let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// GET POST
		let post = res.locals.post;

		// BUILD THE LIKE OBJECT AND GET THE POST INDEX
		let postIndex = await Account.getIndex("posts", { post: post.uniqid });

		// GET USER NAME
		let user = await Account.findOne({ uniqid: req.header("u") }, { _id: 0, first_name: 1, last_name: 1 }, { lean: true });
		let userName = user.first_name + " " + user.last_name;

		let like = {
			user: req.header("u"),
			name: userName
		};

		// IF HAS req.params.comment, PROCCED WITH NEXT HANDLER
		if(req.params.comment){
			res.locals.likeObj = like;
			return next();
		}

		// CHECK IF THE POST IS ALREADY LIKED BY THE USER
		let isLiked = await Account.aggregate([{ $match: { "posts.uniqid": post.uniqid, "posts.likes.user": req.header("u") } }, { $unwind: "$posts" }, { $project: { uniqid: 1, _id: 0 } }]);
		if (isLiked.length !== 0) return res.status(409).send({ message: { post: "Already liked this post" } });

		// SAVE LIKE AND GET POST OBJ
		let poster = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $push: { "posts.$.likes": like } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (poster.nModified === 0) return res.status(422).send({ message: { post: "Cannot like this post" } });
		
		post = poster.posts[postIndex];

		// CHECK IF THE POST IS A SHARE
		if (post.is_share) post.original = await Account.getOriginalPost(post.uniqid);
		
		return res.status(200).send(post);

	} catch (err) {
		next(err);
	}
};

exports.comment = async (req, res, next) => {
	try {
		let post = res.locals.post;
		let comment = res.locals.comment;
		let like = res.locals.likeObj;

		// GET COMMENT AND POST INDEX
		let commentIndex = await Account.getIndex("comments", { post: post.uniqid, comment: comment.uniqid });
		let postIndex = await Account.getIndex("posts", { post: post.uniqid });

		// BUILD THE QUERY TO FIND IF THE USER ALREADY LIKED THE COMMENT
		let query = {
			"posts.uniqid": post.uniqid,
			"posts.comments.uniqid": comment.uniqid,
			[`posts.comments.${commentIndex}.likes.user`]: req.header("u")
		};

		// CHECK IF THE COMMENT IS ALREADY LIKED BY THE USER
		let isLiked = await Account.aggregate([{ $match: query, }, { $unwind: "$posts" }, { $project: { uniqid: 1, _id: 0 }}]);
		if (isLiked.length !== 0) return res.status(409).send({ message: { comment: "Already liked this comment" } });

		// SAVE LIKE AND FIND THE COMMENT OBJECT
		let poster = await Account.findOneAndUpdate({ uniqid: post.poster, [`posts.${postIndex}.comments.uniqid`]: comment.uniqid }, { $push: { [`posts.${postIndex}.comments.${commentIndex}.likes`]: like } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (poster.nModified === 0) return res.status(422).send({ message: { comment: "Cannot like this comment" } });

		comment = poster.posts[postIndex].comments[commentIndex];

		return res.status(200).send(comment);
	} catch (err) {
		next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		// GET POST
		let post = res.locals.post;

		// GET POST INDEX
		let postIndex = await Account.getIndex("posts", { post: post.uniqid }), query;

		// CHECK IF IT IS A COMMENT LIKE
		if (req.params.comment) {

			// GET COMMENT
			let comment = await Account.findOne({ "posts.uniqid": post.uniqid, "posts.comments.uniqid": req.params.comment }, { _id: 0, "posts.$": 1 }, { lean: true });
			if (!comment) return res.status(404).send({ message: { comment: "This comment does not exists" } });

			// GET COMMENT INDEX IN POSTS
			let commentIndex = await Account.getIndex("comments", { post: post.uniqid, comment: req.params.comment });
			
			query = {
				[`posts.${postIndex}.comments.${commentIndex}.likes`]: { user: req.header("u") }
			};

			// CHECK IF THE COMMENT IS LIKED
			let isLiked = await Account.aggregate([{ $match: query }, {$unwind: "$posts" },  { $project: { uniqid: 1, _id: 0 } }]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { comment: "Cannot dislike a comment that is not liked"} });

		} else {

			query = {
				[`posts.${postIndex}.likes`]: { user: req.header("u") }
			};
			
			// CHECK IF THE POST IS LIKED
			let isLiked = await Account.aggregate([{ $match: query }, { $unwind: "$posts" }, { $project: { uniqid: 1, _id: 0 } }]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { post: "Cannot dislike a post that is not liked" } });

		}

		// DELETE LIKE
		let poster = await Account.findOneAndUpdate({ "posts.uniqid": post.uniqid }, { $pull: query }, { runValidators: true, lean: true, new: true });
		if (poster.nModified === 0) return res.status(422).send({ message: { dislike: "Cannot dislike" } });

		return res.status(204).send();
		
	} catch (err) {
		next(err);
	}
};