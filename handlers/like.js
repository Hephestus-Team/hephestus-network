let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {
	try {
		// FIND POST
		let poster = await Account.findOne({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.params.post }, { _id: 0, uniqid: 1, posts: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });

		// BUILD THE LIKE OBJECT AND GET THE POST INDEX
		let postIndex = getIndexByUniqid(poster.posts, req.body.poster.post);

		let like = {
			user: req.header("u"),
			name: req.body.sender.name
		};

		// IF THE COMMENT UNIQID WASNT PASSED, PROCCED ONLY WITH POST
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

			// BUILD THE QUERY FOR FIND THE POST AND PUSH THE LIKE IN
			let findQuery = {
				uniqid: req.body.poster.uniqid, 
				"posts.uniqid": req.params.post
			};

			let pushQuery = {
				"posts.$.likes": like
			};

			// SAVE LIKE AND GET POST OBJ
			poster = await Account.findOneAndUpdate(findQuery, { $push: pushQuery }, { new: true, setDefaultsOnInsert: true, lean: true });
			let post = poster.posts[postIndex];
			
			return res.status(200).send(post);
			
		}else{
			// FIND COMMENT
			let query = { 
				"posts.uniqid": req.params.post, 
				"posts.comments.uniqid": req.params.comment, 
			};

			let comment = await Account.findOne(query, { _id: 0, uniqid: 1, posts: 1 }, { lean: true });
			if (!comment) return res.status(404).send({ message: { comment: "This comment does not exists" } });

			// GET COMMENT INDEX INSIDE THE POST AND BUILD QUERY
			let commentIndex = getIndexByUniqid(poster.posts[postIndex], req.params.comment);

			query = { 
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
			
			// BUILD THE QUERY FOR FIND THE POST AND PUSH THE LIKE IN COMMENT	
			let pushQuery = {
				[`posts.${postIndex}.comments.${commentIndex}.likes`]: like
			};

			let findQuery = { 
				uniqid: req.body.poster.uniqid, 
				"posts.$.comments.uniqid": req.body.commentator.uniqid
			};

			// SAVE LIKE AND FIND THE COMMENT OBJECT
			poster = Account.findOneAndUpdate(findQuery, { $push: pushQuery }, { new: true, setDefaultsOnInsert: true, lean: true });
			comment = poster.posts[postIndex].comments[commentIndex];

			return res.status(200).send(comment);
		}
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
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