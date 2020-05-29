let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {
	let poster;

	try {

		// FIND POSTER
		poster = await Account.findOne({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.params.post }, { _id: 0, uniqid: 1 }, {lean: true});
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}

	// IF COMMENT PARAMS === UNDEFINED, IT IS A COMMENT
	// ELSE IT IS A REPLY
	let comment = {
		uniqid: Account.setUniqid("post"),
		content: req.body.sender.content,
		user: req.header("u"),
		name: req.body.sender.name
	};

	if(!req.params.comment){

		let account, postIndex, commentIndex;

		try {

			// SAVE COMMENT
			account = await Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.params.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true, lean: true });
			if (!account) return res.status(422).send({ message: { comment: "Cannot comment in this post" } });

			postIndex = getIndexByUniqid(account.posts, req.params.post);
			commentIndex = getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);

			return res.status(200).send(account.posts[postIndex].comments[commentIndex]);

		} catch (err) {
			console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
		}
		
	}else{

		let commentator, postIndex, commentIndex;

		let replyMetadata = {
			user: req.body.commentator.uniqid,
			name: req.body.commentator.name,
			comment: req.params.comment
		};
		
		comment.is_reply = true;
		comment.replyMetadata = replyMetadata;

		try {

			
			let projection ={
				$project: {
					uniqid: 1,
					_id: 0
				}
			};
			
			// FIND COMMENT
			let referrerComment = await Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.comments.uniqid": req.params.comment, "posts.comments.user": req.body.commentator.uniqid } }, projection]);
			if (referrerComment.length === 0) return res.status(404).send({ message: { comment: "This comment does not exists" } });

			// SAVE REPLY
			commentator = await Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.params.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true, lean: true});
			if (!commentator) return res.status(422).send({ message: { comment: "Cannot reply this comment" } });
			
			postIndex = getIndexByUniqid(commentator.posts, req.params.post);
			commentIndex = getIndexByUniqid(commentator.posts[postIndex].comments, comment.uniqid);

			return res.status(200).send(commentator.posts[postIndex].comments[commentIndex]);

		}catch(err){

			console.log(err); return res.status(500).send({ message: { database: "Internal error" } });

		}
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
		if (commentator.length === 0) return res.status(400).send({ message: { comment: "This comment does not exists" } });

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
			return res.status(400).send({ message: { comment: "Cannot save same content" } });
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
		let comment = await Account.findOneAndUpdate({uniqid: posterUniqid, "posts.uniqid": req.params.post}, {$pull: query}, {new:true, lean: true});
		if (!comment) return res.status(400).send({ message: { comment: "Cannot delete this comment" } });

		return res.status(204).send();

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
};