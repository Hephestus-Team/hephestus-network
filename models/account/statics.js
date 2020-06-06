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
	getRelationship: async function getRelationship(userUniqid, profileUniqid){
		let profile;
    
		try{
    
			profile = await this.findOne({ $or: [{ uniqid: profileUniqid }] }, { _id: 0, visibility: 1, friendships: 1 }, { lean: true });
			if (!profile) { console.log("This user does not exists"); return null;}
    
		}catch(err){
			return console.log(err);
		}
    
		//IF PROFILE IS PUBLIC, PROFILEISPUBLIC == TRUE
		let profileIsPublic = Boolean(profile.visibility === 1);
    
		//IF SELF PROFILE, RELATIONSHIP == 4
		let selfProfile = Boolean(userUniqid === profileUniqid);
    
		if (selfProfile) return { profileIsPublic, relationship: 4 };
    
		//IF FRIEND, RELATIONSHIP == 2
		let friendships = profile.friendships;
		let friendshipsUniqid = friendships.forEach(friendship => friendship.uniqid);
        
		let isFriend = friendships.some(friendship => (friendship.friend === userUniqid && friendship.is_accepted === true));
    
		if(isFriend) return { profileIsPublic, relationship: 2 };
    
		//IF FRIEND OF A FRIEND, RELATIONSHIP == 3
		let friendsProfile;
    
		try{
            
			friendsProfile = await this.findOne({uniqid: {$in: friendshipsUniqid}, "friendships.friend": userUniqid}, {_id: 0, friendships: 1}, { lean: true });
            
			//IF PROFILE DONT HAVE FRIENDS, RELATIONSHIP == 1
			if(!friendsProfile) return { profileIsPublic, relationship: 1 };
    
		}catch(err){
			throw new Error(err);
		}
    
		let isMutualFriend = friendsProfile.length;
    
		if(isMutualFriend) return { profileIsPublic, relationship: 3 };
    
		//IF ISNT FRIEND NOR MUTUAL FRIEND, RELATIONSHIP == 1
		return { profileIsPublic, relationship: 1 };
    
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
	
			// FIND ORIGINAL'S USER POST
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
	// PROFILE
	parseFriendships: async function (profileUniqid) {
		try {
			// PARSE FRIENDSHIPS
			let profile = await this.findOne({ uniqid: profileUniqid }, { _id: 0, friendships: 1 }, { lean: true });
	
			let friendshipsUniqid = profile.friendships.map(friendship => friendship.friend);
	
			// GET ALL FRIENDS DOCUMENT AND PARSE DATA
			let friendships = await this.find({ uniqid: { $in: friendshipsUniqid } }, { _id: 0, first_name: 1, last_name: 1, uniqid: 1 }, { lean: true });
	
			let friends = [];
	
			friendships.forEach(friend => {
				friends.push({
					uniqid: friend.uniqid,
					name: `${friend.first_name} ${friend.last_name}`
				});
			});
	
			return friends;
	
		} catch (err) {
			console.log(err);
		}
	},
	parsePosts: async function (profileUniqid, userUniqid, { profileIsPublic, relationship } = relationship) {
		try {
			// BUILD QUERY AND SET RELATIONSHIP
			let query = { uniqid: profileUniqid };

			if (!profileIsPublic && relationship !== 4) { query["posts.visibility"] = relationship; }
	
			let projection = {
				$project: {
					"posts.uniqid": 1,
					"posts.content": 1,
					"posts.original": {
						$cond: { if: { $eq: ["$posts.is_share", true] }, then: "$posts.shareMetadata.post", else: false }
					},
					"posts.created_at": 1,
					"posts.visibility": 1,
					"posts.is_share": 1,
					"posts.name": 1,
					"posts.shares": 1,
					"posts.likes": 1,
					"posts.comments": 1,
					"posts.is_liked": {
						$cond: { if: { $eq: ["$posts.likes.user", userUniqid] }, then: true, else: false }
					},
					"posts.poster": profileUniqid,
					_id: 0
				}
			};
	
			// GET POSTS UNIQID
			let profile = await this.aggregate([{$unwind: "$posts"}, { $match: query }, projection, { $sort: { "posts.original": 1 } }]);
			if (profile.length === 0) { return []; }

			// PARSE AGGREGATE ARRAY AND CHECK IF HAS POSTS
			let posts = profile.map(account => account.posts);

			if(!posts) return [];
	
			// CHECK IF HAS SHARES
			let shares = posts.filter(post => post.is_share);
	
			if(shares.length === 0) return posts;
	
			// GET ALL POSTS THAT IS NOT A SHARE
			posts = posts.filter(post => !post.is_share);
	
			// GET ORIGINAL POSTS' UNIQID AND BUILD QUERY
			let originalsUniqid = shares.map(share => share.original);
			query = { "posts.uniqid": { $in: originalsUniqid } };
	
			projection = {
				$project: {
					"posts.uniqid": 1,
					"posts.content": 1,
					"posts.name": 1,
					_id: 0
				}
			};
	
			// GET ORIGINAL POSTS
			let originals = await this.aggregate([{$unwind: "$posts" }, {$match: query}, projection, {$sort: { "posts.uniqid": 1 }}]);
			console.log(query);
			// PARSE AGGREGATE ARRAY
			originals = originals.map(original => original.posts);
			
			// SET SHARES' ORIGINAL OBJ WITH MATCHING ORIGINAL POST
			shares.forEach(share => {
				let original = originals.find(original => original.uniqid == share.original);
				delete share.original;
	
				share.original = (original !== undefined) ? original : false;
			});
	
			// CONCAT NEW SHARES ARRAY WITH POSTS ARRAY
			posts = posts.concat(shares);
			
			return posts;
	
		} catch (err) {
			return console.log(err);
		}
	},
	getProfile: async function (query, userUniqid) {
		try {

			let projection = {
				_id: 0,
				email: 0,
				hash: 0,
				__v: 0,
				created_at: 0
			};
	
			// GET PROFILE DOCUMENT AND STORE FRIENDSHIPS & POSTS IN VARIABLES
			let profile = await this.findOne(query, projection, { lean: true });
			
			let posts = profile.posts;
			let friendships = profile.friendships;
	
			delete profile.posts, profile.friendships;
	
			// GET RELATIONSHIP USER/PROFILE
			let { profileIsPublic, relationship } = await this.getRelationship(userUniqid, profile.uniqid);
	
			profile.isFriend = Boolean(relationship === 2);
			profile.selfProfile = Boolean(relationship === 4);
	
			// CHECK IF HAS A PENDING REQUEST
			profile.hasPendingRequest = friendships.some(friendship => (friendship.is_accepted === false && friendship.friend === userUniqid && friendship.is_sender === false));
	
			// IF HAVE POSTS PARSE POSTS
			if(posts !== 0) profile.posts = await this.parsePosts(profile.uniqid, userUniqid, {profileIsPublic, relationship});
	
			// IF HAVE FRIENDSHIPS PARSE FRIENDSHIPS
			if(friendships !== 0) profile.friendships = await this.parseFriendships(profile.uniqid);
	
			return profile;
	
		} catch (err) {
			console.log(err);
		}
	}
};