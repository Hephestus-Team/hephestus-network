const { Posts } = require("../../collections");

exports.create = async (req, res, next) => {
	try {

		// GET USER DATA
		let user = res.locals.user;

		// BUILD THE POST OBJECT
		let post = new Posts({
			uniqid: Posts.uniqid(),
			poster: user["uniqid"],
			name: user["name"],
			content: req.body.content
		});

		// IF HAS req.params.post ITS A SHARE, GO NO NEXT HANDLER
		if (req.params.post) {
			post["is_share"] = true;
			res.locals.post = post;
			return next();
		}

		// SAVE POST
		let postSaved = (await post.save()).toObject();
		
		delete postSaved["_id"];
		delete postSaved["__v"];
	
		return res.status(200).send(postSaved);

	} catch (err) {
		return next(err);
	}

};

exports.createShare = async (req, res, next) => {
	try {

		// GET REFERRER POST, POST AND USER DATA
		let referrerPost = res.locals.params["post"];
		let post = res.locals.post;
		let user = res.locals.user;

		// IF THE REFERRER POST IS A SHARE, USE THE REFERRER OWN METADATA TO RETRIEVE THE ORIGINAL POST
		// ELSE USE THE REFERRER UNIQID, AND SAVE THE SHARE IN THE REFERRER SHARES ARRAY
		if(referrerPost["is_share"]){
			post["shareMetadata"] = referrerPost["shareMetadata"];
		}else{
			post["shareMetadata"] = { poster: referrerPost["poster"], name: referrerPost["name"], uniqid: referrerPost["uniqid"] };
		}

		// BUILD SHARE OBJ
		let shareObj = {
			poster: user["uniqid"],
			name: user["name"],
			uniqid: post["uniqid"]
		};
		
		// SAVE SHARE IN ORIGINAL
		let postUpdated = await Posts.findOneAndUpdate({ poster: referrerPost["poster"], uniqid: referrerPost["uniqid"] }, { $push: { shares: shareObj } }, { $projection: { _id: 0 }, runValidators: true, new: true });
		if(!postUpdated) return res.status(422).send({message: {}})

		// SAVE POST
		let postSaved = (await post.save()).toObject();

		await Posts.setOriginal(postSaved);

		delete postSaved["_id"];
		delete postSaved["__v"];

		return res.status(200).send(postSaved);

	} catch (err) {
		return next(err);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		// GET POST DATA
		let post = res.locals.params["post"];

		// PARSE POST
		let parsedPost = await Posts.getOnePost(post["uniqid"]);

		return res.status(200).send(parsedPost);

	} catch (err) {
		return next(err);
	}
};

exports.getMultiple = async(req, res, next) => {
	try {
		// SET LIMIT
		let nPosts = 3, q = Number(req.query.q), skip = 0;
		let profile = res.locals.params["user"], user = res.locals.user;

		if(q > 1) skip = q * nPosts;

		// CHECK IF hasMorePosts
		let totalPosts = await Posts.countDocuments({ poster: profile["uniqid"] });
		let hasMorePosts = Boolean(totalPosts <= skip);

		// GET POSTS
		let posts = await Posts.getPosts({ postPoster: profile["uniqid"] }, user["uniqid"], nPosts, skip);

		// SET HEADERS
		res.header({
			hasMorePosts: hasMorePosts
		});

		return res.status(200).send(posts);

	} catch (err) {
		return next(err);
	}
};

exports.edit = async (req, res, next) => {
	try {

		// GET POST
		let post = res.locals.params["post"];
		let user = res.locals.user;

		// CHECK IF OLD CONTENT IS EQUAL TO NEW CONTENT
		if (post.content === req.body.content) {
			return res.status(409).send({ message: { post: "Cannot save same content" } });
		}

		// UPDATE POST
		let old_content = { content: post["content"], modified_at: new Date() };

		let postUpdated = await Posts.findOneAndUpdate({ poster: user["uniqid"], uniqid: post["uniqid"] }, { $set: { content: req.body.content }, $push: { history: old_content } }, { runValidators: true, new: true, lean: true });
		if (!postUpdated) return res.status(422).send({ message: { post: "Cannot update this post" } });

		// IF THE POST IS A SHARE, GET THE ORIGINAL
		if(post["is_share"]) post.original = await Posts.getOriginalPost(post["uniqid"]);
		
		return res.status(200).send(post);

	} catch (err) {
		return next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {

		// GET POST & USER DATA
		let post = res.locals.params["post"];
		let user = res.locals.user;

		// DELETE POST
		let postDeleted = await Posts.findOneAndDelete({ poster: user["uniqid"], uniqid: post["uniqid"] });
		if (!postDeleted) return res.status(422).send({ message: { delete: "Cannot delete this post" } });

		return res.status(204).send();
		
	} catch (err) {
		return next(err);
	}
};
