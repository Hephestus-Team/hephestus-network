let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {
	let poster;

	try {

		// FIND POST
		poster = await Account.findOne({ "posts.uniqid": req.params.post }, { _id: 0, uniqid: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });

		// IF COMMENT PARAMS === UNDEFINED, IT IS A COMMENT
		// ELSE IT IS A REPLY
		let comment = {
			uniqid: Account.setUniqid("post"),
			content: req.body.sender.content,
			user: req.header("u"),
			name: req.body.sender.name
		};

		if (!req.params.comment) {

			// SAVE COMMENT
			let account = await Account.findOneAndUpdate({ uniqid: poster.uniqid, "posts.uniqid": req.params.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true, lean: true });
			if (!account) return res.status(422).send({ message: { comment: "Cannot comment in this post" } });

			let postIndex = getIndexByUniqid(account.posts, req.params.post);
			let commentIndex = getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);

			return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

		} else {

			let projection = {
				$project: {
					uniqid: 1,
					first_name: 1,
					last_name: 1,
					_id: 0
				}
			};

			// FIND COMMENTATOR
			let commentator = await Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.comments.uniqid": req.params.comment } }, projection]);
			if (commentator.length === 0) return res.status(404).send({ message: { comment: "This comment does not exists" } });

			// BUILD THE REPLYMETADATA OBJ
			commentator = commentator[0];

			let replyMetadata = {
				user: commentator.uniqid,
				name: `${commentator.first_name} ${commentator.last_name}`,
				comment: req.params.comment
			};

			// SET NEW PROPERTIES IN THE REPLY
			comment.is_reply = true;
			comment.replyMetadata = replyMetadata;

			// SAVE REPLY
			let account = await Account.findOneAndUpdate({ uniqid: poster.uniqid, "posts.uniqid": req.params.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true, lean: true });
			if (!account) return res.status(422).send({ message: { comment: "Cannot reply this comment" } });

			let postIndex = getIndexByUniqid(account.posts, req.params.post);
			let commentIndex = getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);

			return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

		}
	}
	catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}

};

exports.patch = async (req, res, next) => {
	try {

		// FIND COMMENT
		let projection = {
			$project: {
				_id: 0,
				uniqid: 1,
				posts: 1
			}
		};
		
		let commentator = await Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.comments.uniqid": req.params.comment, "posts.comments.user": req.header("u") } }, projection]);
		if (commentator.length === 0) return res.status(404).send({ message: { comment: "This comment does not exists" } });

		// PARSE AGGREGATE ARRAY
		let post = commentator.map(commentator => commentator.posts)[0];
		let posterUniqid = commentator[0].uniqid;

		// BUILD QUERY
		let commentIndex = getIndexByUniqid(post.comments, req.params.comment);
		let postIndex = "$";

		let queryContent = `posts.${postIndex}.comments.${commentIndex}.content`;
		let queryHistory = `posts.${postIndex}.comments.${commentIndex}.history`;
	
		let old_comment = { content: post.comments[commentIndex].content, modified_at: new Date() };
		
		// CHECK IF THE CONTENT IS THE SAME
		if(old_comment.content === req.body.comment.content) {
			return res.status(409).send({ message: { comment: "Cannot save same content" } });
		}

		// UPDATE COMMENT
		let account = await Account.findOneAndUpdate({uniqid: posterUniqid, "posts.uniqid": req.params.post}, {$set: {[queryContent]: req.body.comment.content}, $push: {[queryHistory]: old_comment}}, {new: true});
		if (!account) return res.status(422).send({ message: { comment: "Cannot update this comment" } });

		postIndex = getIndexByUniqid(account.posts, req.params.post);
		commentIndex = getIndexByUniqid(account.posts[postIndex].comments, req.params.comment);

		return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}

};

exports.delete = async(req, res, next) => {
	let poster;

	try {

		// FIND COMMENT
		let projection = {
			$project: {
				_id: 0,
				uniqid: 1,
				posts: 1
			}
		};

		poster = await Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.comments.uniqid": req.params.comment, "posts.comments.user": req.header("u") } }, projection]);
		if (poster.length === 0) return res.status(404).send({ message: { comment: "This comment does not exists" } });
		
		// GET POSTER UNIQID
		let posterUniqid = poster[0].uniqid;

		// BUILD QUERY
		let postIndex = "$";

		let queryProperty = `posts.${postIndex}.comments`;
		let query = { [queryProperty]: { uniqid: req.params.comment } };

		// DELETE COMMENT
		let comment = await Account.findOneAndUpdate({ uniqid: posterUniqid, "posts.uniqid": req.params.post }, { $pull: query }, { new: true, lean: true });
		if (!comment) return res.status(400).send({ message: { comment: "Cannot delete this comment" } });

		return res.status(204).send();

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
};