let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {
	try {
		// FIND ORIGINAL POST AND GET POSTER
		let referrer = await Account.findOne({"posts.uniqid": req.params.uniqid }, { _id: 0, uniqid: 1, name: 1, posts: 1, first_name: 1, last_name: 1 }, { lean: true });
		if (!referrer) return res.status(404).send({ message: { post: "This post does not exists" } });

		// console.log(referrer);

		let referrerPostIndex = getIndexByUniqid(referrer.posts, req.params.uniqid);
		let referrerPost = referrer.posts[referrerPostIndex];

		// BUILD SHAREMETADATA & QUERY OBJ
		// IF THE REFERRER POST IS A SHARE, USE THE REFERRER OWN METADATA AND BUILD QUERY TO SAVE THE SHARE IN THE ORIGINAL SHARES ARRAY
		// ELSE USE THE REFERRER UNIQID IN PARAMS, AND SAVE THE SHARE IN THE REFERRER SHARES ARRAY
		let shareMetadata, query;

		if(referrerPost.is_share){
			shareMetadata = referrerPost.shareMetadata;
			query = { uniqid: shareMetadata.user, "posts.uniqid": shareMetadata.post };

		}else{
			shareMetadata = { user: referrer.uniqid, name: `${referrer.first_name} ${referrer.last_name}`, post: req.params.uniqid };
			query = { uniqid: referrer.uniqid, "posts.uniqid": req.params.uniqid };
		}

		// BUILD SHARED POST OBJ
		let shared_at = new Date();

		let postObj = {
			uniqid: Account.setUniqid("post"),
			name: req.body.sender.name,
			is_share: true,
			content: req.body.sender.content,
			shareMetadata: shareMetadata,
			created_at: shared_at
		};

		// BUILD SHARE OBJ TO USE IN SHARES ARRAY IN ORIGINAL POST
		let shareObj = {
			user: req.header("u"),
			name: req.body.sender.name,
			post: postObj.uniqid,
			created_at: shared_at
		};

		// SAVE SHARE IN ORIGINAL SHARES ARRAY
		let original = await Account.findOneAndUpdate(query, { $push: { "posts.$.shares": shareObj } }, { new: true, setDefaultsOnInsert: true });
		if (!original) return res.status(422).send({ message: { share: "Cannot share this post" } });

		// SAVE SHARED POST
		let share = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { "posts": postObj } }, { lean: true, new: true, setDefaultsOnInsert: true });
		if (!share) return res.status(422).send({ message: { share: "Cannot share this post" } });

		// GET ORIGINAL OBJ
		let originalIndex = getIndexByUniqid(original.posts, req.params.uniqid);
		original = original.posts[originalIndex];

		// GET SHARE OBJ AND SET POSTER
		let shareIndex = getIndexByUniqid(share.posts, postObj.uniqid);
		share.posts[shareIndex].poster = req.header("u");

		share = share.posts[shareIndex];

		// GET ORIGINAL OBJ
		// console.log(share.uniqid);
		share.original = await Account.getOriginalPost(share.uniqid);

		return res.status(200).send(share);

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}
};