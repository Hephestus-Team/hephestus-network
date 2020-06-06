let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {

	// BUILD THE POST OBJECT
	let post = {
		uniqid: Account.setUniqid("post"),
		content: req.body.content,
		name: req.body.name
	};

	try {

		// SAVE POST
		let poster = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { posts: post } }, { lean: true, new: true, setDefaultsOnInsert: true });
		if (!poster) return res.status(422).send({ message: { publish: "Cannot publish this post" } });

		let postIndex = getIndexByUniqid(poster.posts, post.uniqid);
		poster.posts[postIndex].poster = req.header("u");
	
		return res.status(200).send(poster.posts[postIndex]);

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}

};

exports.get = async (req, res, next) => {
	let relationship;

	try {
		
		// GET POSTER UNIQID AND RELATIONSHIP BETWEEN USER AND POSTER
		let poster = await Account.findOne({ "posts.uniqid": req.params.uniqid }, { _id: 0, uniqid: 1 }, { lean: true });
		if (!poster) return res.status(404).send({ message: { post: "This post does not exists" } });
	
		relationship = await Account.getRelationship(req.header("u"), poster.uniqid);
	
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
	
	// BUILD QUERY USING RELATIONSHIP
	let query = { "posts.uniqid": req.params.uniqid };
	
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

		let poster, projection = { $project: { _id: 0, posts: 1 } };

		// FIND POST
		poster = await Account.aggregate([{$unwind: "$posts"}, {$match: {uniqid: req.header("u"), "posts.uniqid": req.params.uniqid}}, projection]);
		if (poster.length === 0) { return res.status(404).send({ message: { post: "This post does not exists" } }); }
		
		// PARSE AGGREGATE ARRAY
		let old_post = poster.map(poster => { return { content: poster.posts.content, modified_at: new Date() }; })[0];

		// CHECK IF OLD CONTENT IS EQUAL TO NEW CONTENT
		if (old_post.content === req.body.post.content) {
			return res.status(409).send({ message: { post: "Cannot save same content" } });
		}

		// UPDATE POST
		let account = await Account.findOneAndUpdate({ uniqid: req.header("u"), "posts.uniqid": req.params.uniqid }, { $set: { "posts.$.content": req.body.post.content }, $push: { "posts.$.history": old_post } }, { new: true, lean: true });
		if (!account) return res.status(422).send({ message: { post: "Cannot update this post" } });

		let postIndex = getIndexByUniqid(account.posts, req.params.uniqid);
		
		return res.status(200).send(account.posts[postIndex]);

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}
};

exports.delete = async (req, res, next) => {
	try {
		// GET POST
		let poster = await Account.findOne({ uniqid: req.header("u"), "posts.uniqid": req.params.uniqid }, { _id: 0 }, { lean: true });
		if (!poster) return res.status(403).send({ message: { post: "This post does not exists" } });

		// DELETE POST
		let account = await Account.findOneAndUpdate({ uniqid: req.header("u"), "posts.uniqid": req.params.uniqid }, { $pull: { "posts": { "uniqid": req.params.uniqid } } }, { lean: true });
		if (!account) return res.status(422).send({ message: { delete: "Cannot perform this action" } });

		return res.status(204).send({});
	} catch (err) {
		console.log(err); return res.status(500).send({message: {database: "Internal error"}});
	}
};