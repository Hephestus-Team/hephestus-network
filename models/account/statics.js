const bcrypt = require("bcrypt"), uniqid = require("uniqid"), jwt = require("jsonwebtoken"), { mongo: mongoConfig, jwt: jwtConfig } = require("../../credentials/cfg");

module.exports = {
	// AUTH
	setHash: function (password) { 
		return bcrypt.hashSync(password, 10); 
	},
	verifyHash: function (password, hash) { 
		return bcrypt.compareSync(password, hash); 
	},
	setUniqid: function (type) {
		if (type === "user") {
			return uniqid();
		} else if (type === "post") {
			return uniqid.time();
		} else {
			throw new Error("Cannot proccess type");
		}
	},
	getJwtPayload: function (header_token) {
		let token = header_token.split(" ")[1];
		return jwt.verify(token, jwtConfig.secret).id;
	},
	// HELPERS
	getNameByUniqid: async function (uniqid) {
		let name = await this.findOne({ uniqid: uniqid }, { _id: 0, first_name: 1, last_name: 1 });
		return `${name.first_name} ${name.last_name}`;
	},
	getRelationship: async function (userUniqid, profileUniqid){
		let profile;
    
		try{
    
			profile = await this.findOne({ $or: [{ uniqid: profileUniqid }] }, { _id: 0, visibility: 1, friendships: 1 }, { lean: true });
			if (!profile) { console.log("This user does not exists"); return null;}
    
		}catch(err){
			return console.log(err);
		}
    
		//IF PROFILE IS PUBLIC, PROFILEISPUBLIC == TRUE
		let profileIsPublic = Boolean(profile.visibility === 1);
    
		//IF SELF PROFILE, THE USER CAN VIEW ALL POSTS [1,2,3,4]
		let selfProfile = Boolean(userUniqid === profileUniqid);
    
		if (selfProfile) return { profileIsPublic, relationship: [1, 2, 3, 4] };
    
		//IF FRIEND, THE USER CAN VIEW SOME POSTS [1,2,3]
		let isFriend;

		try {

			isFriend = await this.findOne({ uniqid: profileUniqid, $and: [{ "friendships.friend": userUniqid }, { "friendships.is_accepted": true }] }, { lean: true });
		
		} catch (err) {
			return console.log(err);
		}
            
		if (isFriend) return { profileIsPublic, relationship: [1, 2, 3] };
    
		//IF FRIEND OF A FRIEND, THE USER CAN VIEW ONLY [1,3]
		let hasMutualFriend;
    
		try{

			hasMutualFriend = await this.findOne({$and: [{$and: [{ "friendships.friend": userUniqid }, { "friendships.is_accepted": true }]}, {$and: [{ "friendships.friend": profileUniqid }, { "friendships.is_accepted": true }]}]}, {lean: true});

		}catch(err){
			return console.log(err);
		}
    
		if(hasMutualFriend) return { profileIsPublic, relationship: [1,3] };
    
		//IF ISNT FRIEND NOR MUTUAL FRIEND, CAN ONLY VIEW [1]
		return { profileIsPublic, relationship: [1] };
    
	},
	getOriginalPost: async function(shareUniqid){
		try {

			let projection = {
				$project: {
					_id: 0,
					uniqid: 1,
					posts: 1,
					first_name: 1,
					last_name: 1
				}
			};
	
			// FIND ORIGINAL"S USER POST
			let original = await this.aggregate([{ $unwind: "$posts" }, { $match: {"posts.shares.post": shareUniqid} }, projection]);
			if (original.length === 0) return null;
	
			// PARSE AGGREGATE ARRAY
			original = original[0];
	
			// BUILD ORIGINAL OBJ
			let originalObj = {
				poster: original.uniqid,
				name: `${original.first_name} ${original.last_name}`,
				content: original.posts.content,
				created_at: original.posts.created_at
			};
	
			return originalObj;

		} catch (err) {
			return console.log(err);
		}
	},
	getIndex: async function(type, { post, comment, user, friendship }){
		try {
			// BUILD PIPELINES
			let pipelines = {
				"posts": [{
					$match: { "posts.uniqid": post }
				}, {
					$project: { _id: 0, index: { $indexOfArray: ["$posts.uniqid", post] } }
				}],
				"posts/likes": [{
					$match: { "posts.uniqid": post }
				}, {
					$unwind: { path: "$posts" }
				}, {
					$match: { "posts.uniqid": post }
				}, {
					$project: { index: { $indexOfArray: ["$posts.likes.user", user] } }
				}],
				"comments": [{
					$match: { "posts.comments.uniqid": comment }
				}, {
					$unwind: { path: "$posts" }
				}, {
					$match: { "posts.comments.uniqid": comment }
				}, {
					$project: { index: { $indexOfArray: ["$posts.comments.uniqid", comment] } }
				}],
				"comments/likes": [{
					$match: { "posts.uniqid": post }
				}, {
					$unwind: { path: "$posts" }
				}, {
					$match: { "posts.comments.uniqid": comment }
				}, {
					$unwind: { path: "$posts.comments" }
				}, {
					$match: { "posts.comments.uniqid": comment }
				}, {
					$project: { _id: 0, index: { "$indexOfArray": ["$posts.comments.likes.user", user] } }
				}],
				"friendships": [{
					$match: { uniqid: user }
				}, {
					$project: { _id: 0, index: { $indexOfArray: ["$friendships.uniqid", friendship] } }
				}]
			};
	
			let { index } = (await this.aggregate(pipelines[type]))[0];
	
			return index;
		} catch (err) {
			return console.log(err);
		}
	},
	// PROFILE
	parseFriendships: async function (profileUniqid, limit) {
		try {
			// BUILD PIPELINES
			let pipelines = [{
				$match: { uniqid: profileUniqid }
			}, {
				$project: {
					_id: 0,
					friendships: { $slice: [{ $filter: { input: "$friendships", as: "friendship", cond: { $eq: ["$$friendship.is_accepted", true] } } }, -limit] }
				}
			}, {
				$unwind: {
					path: "$friendships"
				}
			}, {
				$project: {
					uniqid: "$friendships.uniqid",
					friend: "$friendships.friend"
				}
			}, {
				$group: {
					_id: "",
					friendship: { "$push": { uniqid: "$uniqid", friend: "$friend" } },
					friendsUniqid: { "$push": "$friend" }
				}
			}];

			// GET FRIENDS UNIQID AND FRIENDSHIP PARSED OBJECTS
			let friendship = await this.aggregate(pipelines);
			let friendsUniqid = friendship[0].friendsUniqid;
			friendship = friendship[0].friendship;

			// BUILD PIPELINES
			pipelines = [{
				$match: { uniqid: { $in: friendsUniqid } }
			}, {
				$project: {
					_id: 0,
					uniqid: 1,
					name: { $concat: ["$first_name", " ", "$last_name"] }
				}
			}];

			// GET FRIENDS NAME
			let names = await this.aggregate(pipelines);

			// SET NAMES FOR EACH FRIEND
			friendship.forEach(friendship => {
				friendship.name = names.find(friend => friend.uniqid === friendship.friend).name;
			});

			return friendship;
		} catch (err) {
			return console.log(err);
		}
	},
	parsePosts: async function (profileUniqid, userUniqid, relationship, {bottomLimit, fixedQuantity}) {
		try {
			// BUILD PIPELINES
			let pipelines = [{
				$match: { uniqid: profileUniqid }
			}, {
				$project: {
					_id: 0,
					first_name: 1,
					last_name: 1,
					uniqid: 1,
					posts: { $slice: [{ $filter: { input: "$posts", as: "post", cond: { $in: ["$$post.visibility", relationship] } } }, bottomLimit, fixedQuantity] }
				}
			}, {
				$unwind: { path: "$posts" }
			}, {
				$addFields: {
					"posts.is_liked": { $cond: { if: { $in: [userUniqid, "$posts.likes.user"] }, then: true, else: false } },
					"posts.name": {$concat: ["$first_name", " ", "$last_name"]},
					"posts.poster": "$uniqid",
					"posts.original": {$cond: {if: {$eq: ["$posts.is_share", true]}, then: "$posts.shareMetadata.post", else: null}}
				}
			}, {
				$sort: { "posts.is_share": -1, "posts.created_at": -1 }
			}, {
				$group: { _id: { is_share: "$posts.is_share" }, posts: { $push: "$posts" } }
			}];
			
			// IF HAS SHARED POSTS => POSTS[0] == SHARED POSTS | POSTS[1] == USER'S ORIGINAL POSTS
			// ELSE => POSTS[0] == USER'S ORIGINAL POSTS
			let posts = await this.aggregate(pipelines);
			if(posts.length === 0) return [];

			// IF USER HAS SHARED POSTS
			if (posts[0]._id.is_share) {
				// BUILD PIPELINES
				pipelines = [{
					$match: { "posts.is_share": true }
				}, {
					$project: {
						_id: 0,
						name: { $concat: ["$first_name", " ", "$last_name"] },
						uniqid: 1,
						posts: { $filter: { input: "$posts", as: "post", cond: { $in: [profileUniqid, "$$post.shares.user"] } } }
					}
				}, {
					$unwind: { path: "$posts" }
				}, {
					$project: {
						name: 1,
						user: "$uniqid",
						content: "$posts.content",
						uniqid: "$posts.uniqid",
						created_at: "$posts.created_at"
					}
				}];

				// GET ORIGINALS
				let originals = await this.aggregate(pipelines);
				if (originals.length === 0) return posts[0].posts.concat(posts[1].posts);

				// SET ORIGINALS IN SHARES
				posts[0].posts.forEach(post => {
					post.original = originals.find(original => original.uniqid === post.original);
				});
				
				let parsedPosts = (posts[1]) ? posts[0].posts.concat(posts[1].posts) : posts[0].posts;

				return parsedPosts;
			}
			
			return posts[0].posts;
	
		} catch (err) {
			return console.log(err);
		}
	},
	getProfile: async function (profileUniqid, userUniqid, friendshipLimit) {
		try {

			let projection = {
				_id: 0,
				email: 0,
				hash: 0,
				__v: 0,
				created_at: 0,
				posts: 0
			};
	
			// GET PROFILE DOCUMENT
			let profile = await this.findOne({uniqid: profileUniqid}, projection, { lean: true });

			// GET RELATIONSHIP
			// let { profileIsPublic, relationship } = await this.getRelationship(profileUniqid, userUniqid);
			
			// IF HAVE POSTS PARSE POSTS
			// if(profile.posts.length !== 0) profile.posts = await this.parsePosts(profile.uniqid, userUniqid, relationship, postsLimit);
	
			// IF HAVE FRIENDSHIPS PARSE FRIENDSHIPS
			if(profile.friendships.length !== 0) profile.friendships = await this.parseFriendships(profile.uniqid, friendshipLimit);

			// SET isFriend, selfProfile and hasPendingRequest
			let pipelines = [{
				$match: {uniqid: profileUniqid}
			}, {
				$project: {
					_id: 0, 
					isFriend: { $cond: { if: { $in: [userUniqid, "$friendships.friend"] }, then: true, else: false } }, 
					hasPendingRequest: { $cond: { if: { $and: [{ $in: [userUniqid, "$friendships.friend"] }, { $eq: ["$friendships.is_accepted", false] }] }, "then": true, "else": false } }
				}
			}];

			let friendshipRequest = await this.aggregate(pipelines);
			friendshipRequest = friendshipRequest[0];

			// { profile.isFriend, profile.hasPendingRequest } = {...friendshipRequest};

			profile.isFriend = friendshipRequest.isFriend;
			profile.selfProfile = Boolean(profileUniqid === userUniqid);
			profile.hasPendingRequest = friendshipRequest.hasPendingRequest;
	
			return profile;
	
		} catch (err) {
			console.log(err);
		}
	}
};

