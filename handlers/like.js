let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {
	try {
		// FIND POST
		let poster = await Account.findOne({ "posts.uniqid": req.params.post }, { _id: 0, uniqid: 1, posts: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });

		// BUILD THE LIKE OBJECT AND GET THE POST INDEX
		let postIndex = getIndexByUniqid(poster.posts, req.params.post);

		let like = {
			user: req.header("u"),
			name: req.body.sender.name
		};

		// IF COMMENT PARAMS === UNDEFINED, THE USER IS LIKING A POST
		// ELSE IT IS LIKING A COMMENT
		if(!req.params.comment){

			let projection = {
				$project: {
					uniqid: 1,
					_id: 0
				}
			};

			// CHECK IF THE POST IS ALREADY LIKED BY THE USER
			let isLiked = await Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.params.post, "posts.likes.user": req.header("u")}}, projection]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { post: "Already liked this post" } });

			// BUILD THE QUERY
			let query = {
				uniqid: poster.uniqid, 
				"posts.uniqid": req.params.post
			};

			// SAVE LIKE AND GET POST OBJ
			poster = await Account.findOneAndUpdate(query, { $push: { "posts.$.likes": like} }, { new: true, setDefaultsOnInsert: true, lean: true });
			if (!poster) return res.status(422).send({ message: { post: "Cannot like this post" } });
			
			let post = poster.posts[postIndex];

			// CHECK IF THE POST IS A SHARE
			if (post.is_share) post.original = await Account.getOriginalPost(post.uniqid);
			
			return res.status(200).send(post);
			
		}else{

			// FIND COMMENT AND GET THE COMMENT INDEX
			let commentIndex = getIndexByUniqid(poster.posts[postIndex].comments, req.params.comment);
			if(commentIndex === -1) return res.status(404).send({ message: { comment: "This comment does not exists" } });

			// BUILD THE QUERY TO FIND IF THE USER ALREADY LIKED THE COMMENT
			let query = { 
				"posts.uniqid": req.params.post, 
				"posts.comments.uniqid": req.params.comment, 
				[`posts.comments.${commentIndex}.likes.user`]: req.header("u")
			};

			let projection = {
				$project: {
					uniqid: 1,
					_id: 0
				}
			};

			// CHECK IF THE COMMENT IS ALREADY LIKED BY THE USER
			let isLiked = await Account.aggregate([{ $unwind: "$posts" }, { $match: query, }, projection]);
			if(isLiked.length !== 0) return res.status(409).send({ message: { comment: "Already liked this comment" } });
			
			// BUILD THE QUERY TO FIND THE POST AND PUSH THE LIKE IN COMMENT	
			let pushQuery = {
				[`posts.${postIndex}.comments.${commentIndex}.likes`]: like
			};

			query = { 
				uniqid: poster.uniqid, 
				[`posts.${postIndex}.comments.uniqid`]: req.params.comment
			};

			// SAVE LIKE AND FIND THE COMMENT OBJECT
			poster = await Account.findOneAndUpdate(query, { $push: pushQuery }, { new: true, setDefaultsOnInsert: true, lean: true });
			if (!poster) return res.status(422).send({ message: { comment: "Cannot like this comment" } });
 
			let comment = poster.posts[postIndex].comments[commentIndex];

			return res.status(200).send(comment);
		}
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}
};

exports.delete = async (req, res, next) => {
	try {
		// FIND POST
		let poster = await Account.findOne({ "posts.uniqid": req.params.post }, { _id: 0, posts: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });

		// GET POST INDEX, AND BUILD QUERY
		let postIndex = getIndexByUniqid(poster.posts, req.params.post), query;

		// CHECK IF IT IS A COMMENT LIKE
		if (req.params.comment) {
			// GET COMMENT INDEX IN POSTS
			let commentIndex = getIndexByUniqid(poster.posts[postIndex].comments, req.params.comment);

			// IF NO COMMENT IS FOUND, THEN IT NOT EXISTS
			if (commentIndex === -1) return res.status(404).send({ message: { comment: "This comment does not exists" } });
			
			query = {
				[`posts.${postIndex}.comments.${commentIndex}.likes`]: { user: req.header("u") }
			};

			// CHECK IF THE COMMENT IS ALREADY LIKED BY THE USER
			let projection = {
				$project: {
					uniqid: 1,
					_id: 0
				}
			};

			// CHECK IF THE COMMENT IS LIKED
			let isLiked = await Account.aggregate([{ $unwind: "$posts" }, { $match: query, }, projection]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { comment: "Cannot dislike a comment that is not liked"} });

		} else {

			query = {
				[`posts.${postIndex}.likes`]: { user: req.header("u") }
			};

			// CHECK IF THE POST IS ALREADY LIKED BY THE USER
			let projection = {
				$project: {
					uniqid: 1,
					_id: 0
				}
			};
			
			// CHECK IF THE POST IS LIKED
			let isLiked = await Account.aggregate([{ $unwind: "$posts" }, { $match: query, }, projection]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { post: "Cannot dislike a post that is not liked" } });

		}

		// DELETE LIKE
		poster = await Account.findOneAndUpdate({"posts.uniqid": req.params.post}, { $pull: query }, {lean: true, new: true});
		if (!poster) return res.status(422).send({ message: { dislike: "Cannot dislike" } });

		return res.status(204).send({});
		
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
};