let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.share = async (req, res, next) => {
	try {
		// FIND ORIGINAL POST AND GET POSTER
		let poster = await Account.findOne({"posts.uniqid": req.params.uniqid }, { _id: 0, uniqid: 1, name: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });

		// BUILD SHARE OBJECTS
		let shared_at = new Date();

		let shareMetadata = {
			user: poster.uniqid,
			name: poster.name,
			post: req.params.uniqid
		};

		let post = {
			uniqid: Account.setUniqid("post"),
			name: req.body.sender.name,
			is_share: true,
			content: req.body.sender.content,
			shareMetadata: shareMetadata,
			created_at: shared_at
		};

		let share = {
			user: req.header("u"),
			name: req.body.sender.name,
			post: post.uniqid,
			created_at: shared_at
		};

		// SAVE SHARE IN ORIGINAL
		let original = await Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { $push: { "posts.$.shares": share } }, { new: true, setDefaultsOnInsert: true });
		if (!original) return res.status(422).send({ message: { share: "Cannot share this post" } });
		else{
			// SAVE SHARE
			let share = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { "posts": post } }, { lean: true, new: true, setDefaultsOnInsert: true });
			if (!share) return res.status(422).send({ message: { share: "Cannot share this post" } });

			// GET ORIGINAL OBJ
			let originalIndex = getIndexByUniqid(original.posts, req.params.uniqid), original = original.posts[originalIndex];
			
			// GET SHARE OBJ AND SET POSTER
			let shareIndex = getIndexByUniqid(share.posts, post.uniqid);
			share.posts[shareIndex].poster = req.header("u");

			return res.status(200).send({share: share.posts[shareIndex], original: original});
		}
	} catch (err) {
		console.log(err); return console.log({ message: { database: "Internal error" } });
	}
};