let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// BUILD THE POST OBJECT
		let post = {
			uniqid: Account.setUniqid("post"),
			content: req.body.content
		};

		// IF HAS req.params.post ITS A SHARE, GO NO NEXT HANDLER
		if (req.params.post) {
			post.is_share = true;
			res.locals.postObj = post;
			return next();
		}

		// SAVE POST
		let account = await Account.findOneAndUpdate({ uniqid: res.locals.user["uniqid"] }, { $push: { posts: post } }, { runValidators: true, lean: true, new: true, setDefaultsOnInsert: true });
		if (account.nModified === 0 || account === null) return res.status(422).send({ message: { publish: "Cannot publish this post" } });

		// GET NEW POST AND SET poster PROPERTY
		// let postIndex = await Account.getIndex("posts", { post: post.uniqid });
		// account.posts[postIndex].poster = res.locals.user["uniqid"];

		let postCreated = await Account.parseOnePost(post.uniqid, res.locals.user["uniqid"]);
	
		return res.status(200).send(postCreated);

	} catch (err) {
		return next(err);
	}

};

exports.share = async (req, res, next) => {
	try {
		// GET REFERRER POST
		let post = res.locals.params["post"];
		let postObj = res.locals.postObj;

		// IF THE REFERRER POST IS A SHARE, USE THE REFERRER OWN METADATA TO RETRIEVE THE ORIGINAL POST
		// ELSE USE THE REFERRER UNIQID, AND SAVE THE SHARE IN THE REFERRER SHARES ARRAY
		let query;

		if(post.is_share){
			postObj.shareMetadata = post.shareMetadata;
			query = { uniqid: post.shareMetadata.user, "posts.uniqid": post.shareMetadata.post };
		}else{
			postObj.shareMetadata = { user: post.poster, name: post.name, post: post.uniqid };
			query = { uniqid: post.poster, "posts.uniqid": post.uniqid };
		}

		// BUILD SHARE OBJ
		let shareObj = {
			user: res.locals.user["uniqid"],
			name: res.locals.user["name"],
			post: postObj.uniqid,
			created_at: new Date()
		};

		// SAVE SHARE OBJ IN ORIGINAL SHARES ARRAY
		let original = await Account.findOneAndUpdate(query, { $push: { "posts.$.shares": shareObj } }, { projection: { _id: 0, posts: 1 }, runValidators: true, new: true, setDefaultsOnInsert: true });
		if (original.nModified === 0 || original === null) return res.status(422).send({ message: { share: "Cannot share this post" } });

		// SAVE POST OBJ IN USER POSTS ARRAY
		let share = await Account.findOneAndUpdate({ uniqid: res.locals.user["uniqid"] }, { $push: { "posts": postObj } }, { projection: { _id: 0, posts: 1 }, runValidators: true, lean: true, new: true, setDefaultsOnInsert: true });
		if (share.nModified === 0 || share === null) return res.status(422).send({ message: { share: "Cannot share this post" } });

		// original = original.posts[0];
		// share = share.posts[0];
		// share.original = {
		// 	name: `${original.first_name} ${original.last_name}`,
		// 	user: original.uniqid,
		// 	content: original.posts[0].content,
		// 	uniqid: original.posts[0].uniqid,
		// 	created_at: original.posts[0].created_at
		// };

		let { sharedPost } = await Account.parseOnePost(shareObj.uniqid, res.locals.user["uniqid"]);
		
		sharedPost.original = await Account.getOriginalPost(sharedPost);

		return res.status(200).send(sharedPost);

	} catch (err) {
		return next(err);
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
		let post = res.locals.params["post"];
		
		// PARSE POST OBJ
		let old_post = { content: post.content, modified_at: new Date() };

		// CHECK IF OLD CONTENT IS EQUAL TO NEW CONTENT
		if (old_post.content === req.body.content) {
			return res.status(409).send({ message: { post: "Cannot save same content" } });
		}

		// UPDATE POST
		let account = await Account.findOneAndUpdate({ uniqid: res.locals.user["uniqid"], "posts.uniqid": post.uniqid }, { $set: { "posts.$.content": req.body.content }, $push: { "posts.$.history": old_post } }, { projection: { _id: 0, posts: 1 }, runValidators: true, new: true, lean: true });
		if (account.nModified === 0 || account === null) return res.status(422).send({ message: { post: "Cannot update this post" } });
		
		// post = account.posts[0];
		let { postEdited } = await Account.parseOnePost(post.uniqid, res.locals.user["uniqid"]);

		if(post.is_share) postEdited.original = await Account.getOriginalPost(post.uniqid);
		
		return res.status(200).send(postEdited);

	} catch (err) {
		return next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		// GET POST
		let post = res.locals.params["post"];

		// DELETE POST
		let account = await Account.findOneAndUpdate({ uniqid: res.locals.user["uniqid"], "posts.uniqid": post.uniqid }, { $pull: { posts: { uniqid: post.uniqid } } }, { runValidators: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { delete: "Cannot perform this action" } });

		return res.status(204).send();
	} catch (err) {
		return next(err);
	}
};
