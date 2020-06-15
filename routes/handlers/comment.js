let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {

		// GET POST
		let post = res.locals.post;

		// GET USER NAME
		let user = await Account.findOne({ uniqid: req.header("u") }, { _id: 0, first_name: 1, last_name: 1 }, { lean: true });
		let userName = user.first_name + " " + user.last_name;

		// BUILD COMMENT OBJECT
		let comment = {
			uniqid: Account.setUniqid("post"),
			content: req.body.content,
			user: req.header("u"),
			name: userName
		};

		// IF HAS req.params.comment, PROCCED WITH NEXT HANDLER
		if (req.params.comment) {
			res.locals.commentObj = comment;
			return next();
		}

		// SAVE COMMENT
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $push: { "posts.$.comments": comment } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { comment: "Cannot comment in this post" } });

		let postIndex = await Account.getIndex("posts", { post: post.uniqid });
		let commentIndex = await Account.getIndex("comments", { post: null, comment: comment.uniqid });

		return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

	}
	catch (err) {
		return next(err);
	}

};

exports.reply = async (req, res, next) => {
	try {
		// GET ORIGINAL COMMENT, NEW COMMENT AND POST
		let comment = res.locals.comment;
		let commentObj = res.locals.commentObj;
		let post = res.locals.post;
	
		// SET NEW PROPERTIES IN THE REPLY
		commentObj.is_reply = true;
		commentObj.replyMetadata = {
			user: comment.user,
			name: comment.name,
			comment: comment.uniqid
		};

		// SAVE REPLY
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $push: { "posts.$.comments": commentObj } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { comment: "Cannot reply this comment" } });
	
		let postIndex = await Account.getIndex("posts", { post: post.uniqid });
		let commentIndex = await Account.getIndex("comments", { post: null, comment: commentObj.uniqid });
	
		return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

	} catch (err) {
		next(err);
	}
};

exports.patch = async (req, res, next) => {
	try {
		let post = res.locals.post;
		let comment = res.locals.comment;

		// BUILD QUERY
		let commentIndex = await Account.getIndex("comments", { post: post.uniqid, comment: comment.uniqid });

		let queryContent = `posts.$.comments.${commentIndex}.content`;
		let queryHistory = `posts.$.comments.${commentIndex}.history`;
	
		let old_comment = { content: comment.content, modified_at: new Date() };
		
		// CHECK IF THE CONTENT IS THE SAME
		if(old_comment.content === req.body.content) {
			return res.status(409).send({ message: { comment: "Cannot save same content" } });
		}

		// UPDATE COMMENT
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $set: { [queryContent]: req.body.content }, $push: { [queryHistory]: old_comment } }, { runValidators: true, new: true });
		if (account.nModified === 0) return res.status(422).send({ message: { comment: "Cannot update this comment" } });

		let postIndex = await Account.getIndex("posts", { post: post.uniqid });
		commentIndex = await Account.getIndex("comments", { post: post.uniqid, comment: comment.uniqid });

		return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

	} catch (err) {
		next(err);
	}

};

exports.delete = async(req, res, next) => {
	try {
		let post = res.locals.post;
		let comment = res.locals.comment;

		// BUILD QUERY
		let queryProperty = "posts.$.comments";
		let query = { [queryProperty]: { uniqid: comment.uniqid } };

		// DELETE COMMENT
		comment = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $pull: query }, { runValidators: true, new: true, lean: true });
		if (comment.nModified === 0) return res.status(400).send({ message: { comment: "Cannot delete this comment" } });

		return res.status(204).send();

	} catch (err) {
		next(err);
	}
};