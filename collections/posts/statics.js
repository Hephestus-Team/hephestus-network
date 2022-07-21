const uniqid = require("uniqid");

module.exports = {
	uniqid: function() {
		return uniqid.time();
	},
	getComments: async function ({ postPoster, postUniqid }, userUniqid, nComments){
		// BUILD PIPELINES
		let pipelines = [{
			$match: { poster: postPoster, uniqid: postUniqid }
		}, {
			$project: { _id: 0, uniqid: 1, comments: { $slice: ["$comments", -nComments] } }
		}, {
			$unwind: { path: "$comments" }
		}, {
			$addFields: { "comments.is_liked": { $cond: { if: { $in: [userUniqid, "$comments.likes.user"] }, then: true, else: false }} }
		}, {
			$group: { _id: "$uniqid", comments: { $push: "$comments" } }
		}];

		// AGGREGATE
		let comments = await this.aggregate(pipelines);
		if(comments.length === 0) return [];

		return comments[0].comments;
	},
	getOneComment: async function ({postPoster, postUniqid, commentUniqid}, userUniqid) {
		// BUILD PIPELINES
		let pipelines = [{
			$match: { poster: postPoster, uniqid: postUniqid }
		}, {
			$project: { _id: 0, comments: 1 }
		}, {
			$unwind: { path: "$comments" }
		}, {
			$match: { "comments.uniqid": commentUniqid }
		}, {
			$project: { "comments.is_liked": { $cond: { if: { $in: [userUniqid, "$comments.likes.user"], then: true, else: false } } } }
		}];

		// AGGREGATE
		let comment = (await this.aggregate(pipelines))[0].comments;

		return comment;
	},
	getPosts: async function ({ postPoster }, userUniqid, nPosts, skip) {
		// BUILD POSTS PIPELINES
		let postsPipelines = [{
			$match: { poster: postPoster }
		}, {
			$sort: { created_at: -1 }
		}, {
			$skip: skip
		}, {
			$limit: nPosts
		}, {
			$project: {
				_id: 0,
				uniqid: 1,
				name: 1,
				poster: 1,
				content: 1,
				is_share: 1,
				shareMetadata: 1,
				likes: { $slice: ["$likes", -3] },
				shares: { $slice: ["$shares", -3] },
				sharesCount: { $size: "$shares" },
				likesCount: { $size: "$likes" },
				commentsCount: { $size: "$comments" },
				is_liked: { $cond: { if: { $in: [userUniqid, "$likes.user"] }, then: true, else: false } },
				created_at: 1
			}
		}, {
			$group: {
				_id: "$is_share",
				"posts": {
					$push: "$$ROOT"
				}
			}
		}];

		// AGGREGATE
		let posts = await this.aggregate(postsPipelines);

		// SET ORIGINALS
		if(posts[0]["_id"] === true){
			await this.setOriginals(posts[0]["posts"]);

			posts = posts[0]["posts"].concat(posts[1]["posts"]);
		}else{
			posts = posts[0].posts;
		}		

		// GET COMMENTS
		for(let post of posts){
			let postUniqid = post["uniqid"];
			post["comments"] = await this.getComments({ postPoster, postUniqid }, userUniqid, 3);
		}

		return posts;
	},
	getOnePost: async function ({ postPoster, postUniqid }, userUniqid) {
		// BUILD PIPELINES FOR POST
		let pipelines = [{
			$match: { poster: postPoster, uniqid: postUniqid }
		}, {
			$project: {
				_id: 0,
				likes: { $slice: ["$likes", -3] },
				shares: { $slice: ["$shares", -3] },
				sharesCount: { $size: "$shares" },
				likesCount: { $size: "$likes" },
				commentsCount: { $size: "$comments" },
				is_liked: {
					$cond: { if: { $in: [userUniqid, "$likes.user"] }, then: true, else: false },
				}
			}
		}];

		// AGGREGATE POST
		let post = (await this.aggregate(pipelines))[0];

		// GET COMMENTS
		post["comments"] = await this.getComments({ postPoster, postUniqid }, userUniqid, 3);

		// IF ITS A SHARE, GET ORIGINAL
		if(post["is_share"]) await this.setOriginal(post);

		return post;
	},
	setOriginal: async function (post) {
		// GET ORIGINAL DOCUMENT
		let originalPost = await this.findOne({ poster: post["shareMetadata"]["poster"], uniqid: post["shareMetadata"]["uniqid"] }, { _id: 0, content: 1, created_at: 1 }, { lean: true });

		post["shareMetadata"] = { ...post["shareMetadata"], ...originalPost };

	},
	setOriginals: async function (posts){
		// SET ORIGINALS
		for(let post of posts){
			await this.setOriginal(post);
		}
	}
};