const Account = require("../../models/account");

module.exports = {
	user: async (req, res, next) => {
		try {
			let userExists = await Account.findOne({ uniqid: req.params.user }, { _id: 0, friendships: 1, posts: 1, uniqid: 1 }, { lean: true });

			if(!userExists) return res.status(404).send({ message: { user: "This user does not exists" } });

			res.locals.params["user"] = userExists;

			return next();
		} catch (err) {
			return next(err);
		}
	},
	post: async (req, res, next) => {
		try {
			let postExists = await Account.findOne({ "posts.uniqid": req.params.post }, { _id: 0, "posts.$": 1, uniqid: 1, first_name: 1, last_name: 1 }, { lean: true });

			if(!postExists) return res.status(404).send({ message: { post: "This post does not exists" } });

			let post = postExists.posts[0];

			post.name = postExists.first_name + " " + postExists.last_name;
			post.poster = postExists.uniqid;
	
			res.locals.params["post"] = post;
			
			return next();
		} catch (err) {
			return next(err);
		}
	},
	comment: async (req, res, next) => {
		try {
			let commentExists = await Account.findOne({ "posts.uniqid": req.params.post, "posts.comments.uniqid": req.params.comment }, { _id: 0, "posts.$": 1 }, { lean: true });

			if(!commentExists) return res.status(404).send({ message: { comment: "This comment does not exists" } });
	
			let commentIndex = await Account.getIndex("comments", { post: null, comment: req.params.comment, user: null, friendship: null }); 
			let comment = commentExists.posts[0].comments[commentIndex];
	
			res.locals.params["comment"] = comment;
	
			return next();
		} catch (err) {
			return next(err);
		}
	}
};