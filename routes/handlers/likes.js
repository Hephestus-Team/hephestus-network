const { Logins, Users, Posts, Friendships } = require("../../collections");

exports.create = async (req, res, next) => {
	try {

		// GET POST & USER DATA
		let post = res.locals.params["post"];
		let user = res.locals.user;

		// BUILD LIKED OBJ
		let like = {
			user: user["uniqid"],
			name: user["name"]
		};

		// CHECK IF ITS A COMMENT LIKE
		if(req.params.comment){
			res.locals.like = like;
			return next();
		}

		// CHECK IF POST IS ALREADY LIKED
		let isLiked = await Posts.findOne({ poster: post["poster"], uniqid: post["uniqid"], likes: user["uniqid"] }, { _id: 0, uniqid: 1 }, { lean: true });
		if (isLiked) return res.status(409).send({ message: { post: "This post is already liked" } });

		// UPDATE POST
		let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"] }, { $push: { likes: like } }, { runValidators: true, new: true, lean: true, projection: { _id: 0 } });
		if (!postUpdated) return res.status(422).send({ message: { post: "Cannot update this post" } });

		return res.status(200).send(postUpdated);

	} catch (err) {
		return next(err);
	}
};

exports.createComment = async (req, res, next) => {
	try {

		// GET POST, COMMENT, USER & LIKE OBJ DATA
		let post = res.locals.params["post"], comment = res.locals.params["comment"];
		let user = res.locals.user, like = res.locals.like;

		// CHECK IF USER ALREADY LIKED THE COMMENT
		let isLiked = await Posts.findOne({ poster: post["poster"], uniqid: post["uniqid"], "comments.uniqid": comment["uniqid"], "comments.$.likes.user": user["uniqid"] }, { _id: 0, uniqid: 1 });
		if (isLiked) return res.status(409).send({ message: { comment: "This comment is already liked" } });

		// UPDATE POST
		let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"], "comments.uniqid": comment["uniqid"] }, { $push: { "comments.$.likes": like } }, { runValidators: true, new: true, lean: true, projection: { _id: 0 } });
		if (!postUpdated) return res.status(422).send({ message: { post: "Cannot update this post" } });

		// GET COMMENT LIKED
		let commentLiked = await Posts.getComment(post["uniqid"], comment["uniqid"]);

		return res.status(200).send(commentLiked);

	} catch (err) {
		return next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		// CHECK IF COMMENT OR POST DISLIKE
		if (!req.params.comment) {

			// GET POST & USER DATA
			let post = res.locals.params["post"], user = res.locals.user;

			// CHECK IF POST IS LIKED
			let isLiked = await Posts.findOne({ poster: post["poster"], uniqid: post["uniqid"], likes: user["uniqid"] }, { _id: 0, uniqid: 1 }, { lean: true });
			if (!isLiked) return res.status(409).send({ message: { post: "This post is not liked" } });

			// UPDATE POST
			let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"] }, { $pull: { likes: { user: user["uniqid"] } } }, { runValidators: true, new: true, lean: true, projection: { _id: 0 } });
			if (!postUpdated) return res.status(422).send({ message: { post: "Cannot update this post" } });

			return res.status(204).send();

		}else{

			// GET POST, COMMENT & USER DATA
			let post = res.locals.params["post"], user = res.locals.user;
			let comment = res.locals.params["comment"];

			// CHECK IF COMMENT IS LIKED
			let isLiked = await Posts.findOne({ poster: post["poster"], uniqid: post["uniqid"], "comments.uniqid": comment["uniqid"], "comments.$.likes.user": user["uniqid"] }, { _id: 0, uniqid: 1 });
			if (!isLiked) return res.status(409).send({ message: { comment: "This comment is not liked" } });

			// UPDATE POST
			let postUpdated = await Posts.findOneAndUpdate({ poster: post["poster"], uniqid: post["uniqid"], "comments.uniqid": comment["uniqid"] }, { $pull: { "comments.$.likes": { user: user["uniqid"]} } }, { runValidators: true, new: true, lean: true, projection: { _id: 0 } });
			if (!postUpdated) return res.status(422).send({ message: { post: "Cannot update this post" } });

			return res.status(204).send();

		}
	} catch (err) {
		return next(err);
	}
};