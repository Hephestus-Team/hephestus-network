let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// BUILD THE POST OBJECT
		let post = {
			uniqid: Account.setUniqid("post"),
			content: req.body.content
		};

		// IF HAS req.params.post ITS A SHARE, GO NO NEXT HANDLER
		if (req.params.post) { res.locals.postObj = post; return next(); }

		// SAVE POST
		let poster = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { posts: post } }, { runValidators: true, lean: true, new: true, setDefaultsOnInsert: true });
		if (!poster) return res.status(422).send({ message: { publish: "Cannot publish this post" } });

		// GET NEW POST AND SET poster PROPERTY
		let postIndex = await Account.getIndex("posts", { post: post.uniqid });
		poster.posts[postIndex].poster = req.header("u");
	
		return res.status(200).send(poster.posts[postIndex]);

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}

};

exports.share = async (req, res, next) => {
	try {
		// GET ORIGINAL POST
		let post = res.locals.post;
		let postObj = res.locals.postObj;

		// BUILD SHAREMETADATA & QUERY OBJ
		// IF THE REFERRER POST IS A SHARE, USE THE REFERRER OWN METADATA AND BUILD QUERY TO SAVE THE SHARE IN THE ORIGINAL SHARES ARRAY
		// ELSE USE THE REFERRER UNIQID IN PARAMS, AND SAVE THE SHARE IN THE REFERRER SHARES ARRAY
		let shareMetadata, query;

		if(post.is_share){
			shareMetadata = post.shareMetadata;
			query = { uniqid: shareMetadata.user, "posts.uniqid": shareMetadata.post };

		}else{
			shareMetadata = { user: post.poster, name: post.name, post: req.params.post };
			query = { uniqid: post.poster, "posts.uniqid": post.uniqid };
		}

		postObj.shareMetadata = shareMetadata;
		postObj.is_share = true;

		// BUILD SHARE OBJ TO USE IN SHARES ARRAY IN ORIGINAL POST
		let sharer = await Account.findOne({ uniqid: req.header("u") }, { _id: 0, first_name: 1, last_name: 1 }, { lean: true });
		let sharerName = sharer.first_name + " " + sharer.last_name;

		let shareObj = {
			user: req.header("u"),
			name: sharerName,
			post: postObj.uniqid,
			created_at: new Date()
		};

		// SAVE SHARE IN ORIGINAL SHARES ARRAY
		let original = await Account.findOneAndUpdate(query, { $push: { "posts.$.shares": shareObj } }, { runValidators: true, new: true, setDefaultsOnInsert: true });
		if (original.nModified === 0) return res.status(422).send({ message: { share: "Cannot share this post" } });

		// SAVE SHARED POST
		let share = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { "posts": postObj } }, { runValidators: true, lean: true, new: true, setDefaultsOnInsert: true });
		if (share.nModified === 0) return res.status(422).send({ message: { share: "Cannot share this post" } });

		// GET SHARE OBJ AND SET POSTER
		let shareIndex = await Account.getIndex("posts", { post: postObj.uniqid });

		share = share.posts[shareIndex];
		share.poster = req.header("u");
		share.original = post;

		return res.status(200).send(share);

	} catch (err) {
		next(err);
	}
};

// NEED REVIEW !!!!
exports.get = async (req, res, next) => {
	let relationship;

	try {
		
		// GET POSTER UNIQID AND RELATIONSHIP BETWEEN USER AND POSTER
		let poster = await Account.findOne({ "posts.uniqid": req.params.post }, { _id: 0, uniqid: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });
	
		relationship = await Account.getRelationship(req.header("u"), poster.uniqid);
	
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
	
	// BUILD QUERY USING RELATIONSHIP
	let query = { "posts.uniqid": req.params.post };
	
	if (relationship) query["posts.visibility"] = relationship;
	
	// FIND POST AND MANIPULATE DATA TO CHECK IF THE POST IS LIKED AND IF THE USER IS THE POSTER
	// AND SET THE POSTER UNIQID IN THE RESPONSE OBJ
	let projection = {
		$project: {
			"uniqid": 1,
			"posts.uniqid": 1,
			"posts.content": 1,
			"posts.created_at": 1,
			"posts.visibility": 1,
			"posts.is_share": 1,
			"posts.name": 1,
			"posts.shares": 1,
			"posts.likes": 1,
			"posts.comments": 1,
			"posts.is_liked": {
				$cond: { if: { $eq: ["$posts.likes.user", req.header("u")] }, then: true, else: false }
			},
			_id: 0
		}
	};
	
	try {
			
		let poster = await Account.aggregate([{$unwind: "$posts"}, {$match: query}, projection]);
		if (poster.length === 0) return res.status(422).send({ message: { post: "This post does not exists" } });
	
		let post = poster.map((poster => poster.posts))[0];
	
		post.is_poster = (poster[0].uniqid === req.header("u")) ? true : false;
		post.poster = poster[0].uniqid;
	
		return res.status(200).send(post);
	
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
};

exports.patch = async (req, res, next) => {
	try {

		// GET POST
		let post = res.locals.post;
		
		// PARSE POST OBJ
		let old_post = { content: post.content, modified_at: new Date() };

		// CHECK IF OLD CONTENT IS EQUAL TO NEW CONTENT
		if (old_post.content === req.body.content) {
			return res.status(409).send({ message: { post: "Cannot save same content" } });
		}

		// UPDATE POST
		let account = await Account.findOneAndUpdate({ uniqid: req.header("u"), "posts.uniqid": post.uniqid }, { $set: { "posts.$.content": req.body.content }, $push: { "posts.$.history": old_post } }, { runValidators: true, new: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { post: "Cannot update this post" } });

		if(post.is_share) post.original = await Account.getOriginalPost(post.uniqid);
		let postIndex = await Account.getIndex("posts", { post: post.uniqid });
		
		return res.status(200).send(account.posts[postIndex]);

	} catch (err) {
		next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {

		// DELETE POST
		let post = await Account.findOneAndUpdate({ uniqid: req.header("u"), "posts.uniqid": req.params.post }, { $pull: { "posts": { "uniqid": req.params.post } } }, { runValidators: true, lean: true });
		if (post.nModified === 0) return res.status(422).send({ message: { delete: "Cannot perform this action" } });

		return res.status(204).send();
	} catch (err) {
		next(err);
	}
};