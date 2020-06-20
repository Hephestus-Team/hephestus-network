let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// GET POST
		let post = res.locals.params["post"];

		// BUILD COMMENT OBJECT
		let comment = {
			uniqid: Account.setUniqid("post"),
			content: req.body.content,
			user: res.locals.user["user"],
			name: res.locals.user["name"]
		};

		// IF HAS req.params.comment IT IS A REPLY, PROCCED WITH NEXT HANDLER
		if (req.params.comment) { 
			comment.is_reply = true;
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
		let comment = res.locals.params["comment"];
		let post = res.locals.params["post"];
		let commentObj = res.locals.commentObj;
	
		// SET REPLY METADATA
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
		return next(err);
	}
};

exports.patch = async (req, res, next) => {
	try {
		// GET POST AND COMMENT
		let post = res.locals.params["post"];
		let comment = res.locals.params["comment"];

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
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $set: { [queryContent]: req.body.content }, $push: { [queryHistory]: old_comment } }, { runValidators: true, new: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { comment: "Cannot update this comment" } });

		let postIndex = await Account.getIndex("posts", { post: post.uniqid });

		return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

	} catch (err) {
		return next(err);
	}

};

exports.delete = async(req, res, next) => {
	try {
		// GET POST AND COMMENT
		let post = res.locals.params["post"];
		let comment = res.locals.params["comment"];

		// DELETE COMMENT
		let account = await Account.findOneAndUpdate({ uniqid: post.poster, "posts.uniqid": post.uniqid }, { $pull: { "posts.$.comments": { uniqid: comment.uniqid } } }, { runValidators: true, new: true, lean: true });
		if (account.nModified === 0) return res.status(400).send({ message: { comment: "Cannot delete this comment" } });

		return res.status(204).send();

	} catch (err) {
		next(err);
	}
};