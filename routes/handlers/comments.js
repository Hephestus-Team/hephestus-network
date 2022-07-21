const { Logins, Users, Posts, Friendships } = require("../../collections");

exports.create = async (req, res, next) => {
	try {

		// GET POST & USER DATA
		let post = res.locals.params["post"];
		let user = res.locals.user;

		// BUILD COMMENT OBJECT
		let comment = {
			uniqid: Posts.uniqid(),
			content: req.body.content,
			commentator: user["uniqid"],
			name: user["name"],
			created_at: new Date()
		};

		// IF HAS req.params.comment IT IS A REPLY, PROCCED WITH NEXT HANDLER
		if (req.params.comment) { 
			comment["is_reply"] = true;
			res.locals.comment = comment; 
			return next(); 
		}

		// UPDATE POST DOCUMENT WITH NEW COMMENT
		let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"] }, { $push: { comments: comment } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (!postUpdated) return res.status(422).send({ message: { comment: "Cannot comment in this post" } });

		// GET COMMENT
		let commentCreated = await Posts.getComment(postUpdated["uniqid"], comment["uniqid"]);

		return res.status(200).send(commentCreated);

	} catch (err) {
		return next(err);
	}

};

exports.createReply = async (req, res, next) => {
	try {

		// GET ORIGINAL COMMENT, NEW COMMENT AND POST DATA
		let comment = res.locals.params["comment"];
		let post = res.locals.params["post"];
		let commentObj = res.locals.comment;
	
		// SET REPLY METADATA
		commentObj["replyMetadata"] = {
			commentator: comment["user"],
			name: comment["name"],
			uniqid: comment["uniqid"]
		};

		// UPDATE POST DOCUMENT WITH NEW COMMENT
		let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"] }, { $push: { comments: comment } }, { runValidators: true, new: true, setDefaultsOnInsert: true, lean: true });
		if (!postUpdated) return res.status(422).send({ message: { comment: "Cannot comment in this post" } });

		// GET COMMENT
		let commentCreated = await Posts.getComment(postUpdated["uniqid"], commentObj["uniqid"]);

		return res.status(200).send(commentCreated);

	} catch (err) {
		return next(err);
	}
};

exports.edit = async (req, res, next) => {
	try {

		// GET POST & COMMENT DATA
		let post = res.locals.params["post"];
		let comment = res.locals.params["comment"];
	
		let old_content = { content: comment.content, modified_at: new Date() };
		
		// CHECK IF THE CONTENT IS THE SAME
		if(comment["content"] === req.body.content) {
			return res.status(409).send({ message: { comment: "Cannot save same content" } });
		}

		// UPDATE POST
		let postUpdated = await Posts.findOneAndUpdate({ uniqid: post["uniqid"], "comments.uniqid": comment["uniqid"] }, { $set: { "comments.$.content": req.body.content }, $push: { "comments.$.history": old_content} }, { runValidators: true, new: true, lean: true });
		if (!postUpdated) return res.status(422).send({ message: { comment: "Cannot update this comment" } });

		// GET UPDATED COMMENT
		let commentUpdated = await Posts.getComment(postUpdated["uniqid"], comment["uniqid"]);

		return res.status(200).send(commentUpdated);

	} catch (err) {
		return next(err);
	}

};

exports.delete = async(req, res, next) => {
	try {
		// GET POST & COMMENT DATA
		let post = res.locals.params["post"];
		let comment = res.locals.params["comment"];

		// UPDATE POST
		let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"] }, { $pull: { comments: { uniqid: comment["uniqid"] } } }, { runValidators: true, new: true, lean: true });
		if (!postUpdated) return res.status(400).send({ message: { comment: "Cannot delete this comment" } });

		return res.status(204).send();

	} catch (err) {
		return next(err);
	}
};