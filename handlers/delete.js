let Account = require("../models/account");

// BETTER USE 204 IF RETURNING NOTHING IN BODY RESPONSE

exports.add = (req, res, next) => {
	Account.findOne({$and: [{"friendships.uniqid": req.params.uniqid}, {uniqid: {$ne: req.header("u")}}]}, (err, account) => {
		if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if (!account) { return res.status(403).send({ message: { user: "Friendship request does not exist" } }); }

		Account.updateMany({"friendships.uniqid": req.params.uniqid}, { $pull: { "friendships": { "uniqid": req.params.uniqid } } }, (err, account) => {
			if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
			if (!account) { return res.status(403).send({ message: { user: "Friendship request does not exist" } }); }
	
			return res.status(200).send({ message: { friendship: "The request has been deleted" } });
		});
	});
};

exports.publish = (req, res, next) => {
	Account.findOne({uniqid: req.header("u"), "posts.uniqid": req.params.uniqid}, {_id: 0, uniqid: 1}, (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {post: "Post does not exists"}}); }

		Account.findOneAndUpdate({uniqid: req.header("u")}, {$pull: {"posts": {"uniqid": req.params.uniqid}}}, (err, account) => {
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {post: "Post does not exists"}}); }
	
			return res.status(204).send({message: {post: "Post deleted"}});
		});
	});
};

exports.like = (req, res, next) => {
	Account.findOne({"posts.uniqid": req.params.post}, {_id: 0, posts: 1}, (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {user: "This post does not exists"}}); }
	
		let postIndex = Account.getIndexByUniqid(account.posts, req.params.post);
		let queryProperty = `posts.${postIndex}`;
	
		if(req.params.comment) {
			let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, req.params.comment);
			
			if(commentIndex === -1){
				return res.status(403).send({message: {comment: "This comment does not exists"}});
			}

			queryProperty += `.comments.${commentIndex}.likes`;
		}else{
			queryProperty += ".likes";
		}
	
		let query = {
			[queryProperty]: { user: req.header("u")}
		};
	
		Account.findOneAndUpdate({"posts.uniqid": req.params.post}, { $pull: query }, (err, account) => {
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {post: "This post is not liked by the user"}}); }
		
			return res.status(204).send({message: {like: "Disliked"}});
		});
	});
};