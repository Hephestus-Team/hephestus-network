const { Logins, Users, Posts, Friendships } = require("../../collections");

module.exports = {
	user: async (req, res, next) => {
		try {
			let user = await Users.findOne({ uniqid: req.params.user }, { _id: 0, first_name: 1, last_name: 1, uniqid: 1, username: 1 }, { lean: true });
			if(!user) return res.status(404).send({ message: { user: "This user does not exists" } });

			user["name"] = user["first_name"] + " " + user["last_name"];

			delete user["first_name"];
			delete user["last_name"];

			res.locals.params["user"] = user;

			return next();

		} catch (err) {
			return next(err);
		}
	},
	post: async (req, res, next) => {
		try {

			// GET REFERRER POST DATA
			let post = await Posts.findOne({ uniqid: req.params.post }, { _id: 0, uniqid: 1, name: 1, poster: 1, shareMetadata: 1, is_share: 1 }, { lean: true });
			if(!post) return res.status(404).send({ message: { post: "This post does not exists" } });
	
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
	},
	friendship: async (req, res, next) => {
		try {
			
			// GET FRIENDSHIP DATA
			let friendship = await Friendships.findOne({ uniqid: req.params.friendship }, { lean: true });
			if (!friendship) return res.status(404).send({ message: { friendship: "This friendship request does not exists" } });

			res.locals.params["friendship"] = friendship;

			return next();

		} catch (err) {
			return next(err);
		}
	}
};