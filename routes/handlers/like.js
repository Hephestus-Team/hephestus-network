let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// GET POST
		let post = res.locals.params["post"];

		// BUILD THE LIKE OBJECT AND GET THE POST INDEX
		let postIndex = await Account.getIndex("posts", { post: post.uniqid });

		let like = {
			user: res.locals.user["uniqid"],
			name: res.locals.user["name"]
		};

		// IF HAS req.params.comment, PROCCED WITH NEXT HANDLER
		if(req.params.comment){
			res.locals.likeObj = like;
			res.locals.postIndex = postIndex;
			return next();
		}

		// CHECK IF THE POST IS ALREADY LIKED BY THE USER
		let isLiked = await Account.aggregate([{ $match: { "posts.uniqid": post.uniqid, "posts.likes.user": res.locals.user["uniqid"] } }, { $project: { uniqid: 1, _id: 0 } }]);
		if (isLiked.length !== 0) return res.status(409).send({ message: { post: "Already liked this post" } });

		// SAVE LIKE AND GET POST OBJ
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $push: { "posts.$.likes": like } }, { "posts.$": 1, runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { post: "Cannot like this post" } });
		
		let { updatedPost } = await Account.parseOnePost(post.uniqid, res.locals.user["uniqid"]);

		// CHECK IF THE POST IS A SHARE
		if (updatedPost.is_share) updatedPost.original = await Account.getOriginalPost(post.uniqid);
		
		return res.status(200).send(updatedPost);

	} catch (err) {
		return next(err);
	}
};

exports.comment = async (req, res, next) => {
	try {
		// GET POST, COMMENT, LIKE OBJECT AND POST INDEX
		let post = res.locals.params["post"];
		let comment = res.locals.params["comment"];
		let like = res.locals.likeObj;
		let postIndex = res.locals.postIndex;

		// GET COMMENT INDEX
		let commentIndex = await Account.getIndex("comments", { post: post.uniqid, comment: comment.uniqid });

		// BUILD THE QUERY TO FIND IF THE USER ALREADY LIKED THE COMMENT
		let query = {
			"posts.uniqid": post.uniqid,
			"posts.comments.uniqid": comment.uniqid,
			[`posts.comments.${commentIndex}.likes.user`]: res.locals.user["uniqid"]
		};

		// CHECK IF THE COMMENT IS ALREADY LIKED BY THE USER
		let isLiked = await Account.aggregate([{ $match: query, }, { $project: { uniqid: 1, _id: 0 }}]);
		if (isLiked.length !== 0) return res.status(409).send({ message: { comment: "Already liked this comment" } });

		// SAVE LIKE AND FIND THE COMMENT OBJECT
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, [`posts.${postIndex}.comments.uniqid`]: comment.uniqid }, { $push: { [`posts.${postIndex}.comments.${commentIndex}.likes`]: like } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { comment: "Cannot like this comment" } });

		comment = account.posts[postIndex].comments[commentIndex];

		return res.status(200).send(comment);
	} catch (err) {
		return next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		// GET POST
		let post = res.locals.params["post"];

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
				[`posts.${postIndex}.comments.${commentIndex}.likes`]: { user: res.locals.user["uniqid"] }
			};

			// CHECK IF THE COMMENT IS LIKED
			let isLiked = await Account.aggregate([{ $match: query }, {$unwind: "$posts" },  { $project: { uniqid: 1, _id: 0 } }]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { comment: "Cannot dislike a comment that is not liked"} });

		} else {

			query = {
				[`posts.${postIndex}.likes`]: { user: res.locals.user["uniqid"] }
			};
			
			// CHECK IF THE POST IS LIKED
			let isLiked = await Account.aggregate([{ $match: query }, { $unwind: "$posts" }, { $project: { uniqid: 1, _id: 0 } }]);
			if (isLiked.length !== 0) return res.status(409).send({ message: { post: "Cannot dislike a post that is not liked" } });

		}

		// DELETE LIKE
		let account = await Account.findOneAndUpdate({ "posts.uniqid": post.uniqid }, { $pull: query }, { runValidators: true, lean: true, new: true });
		if (account.nModified === 0 || account === null) return res.status(422).send({ message: { dislike: "Cannot dislike" } });

		return res.status(204).send();
		
	} catch (err) {
		return next(err);
	}
};