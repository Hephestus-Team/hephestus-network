let Account = require("../models/account");

// BETTER USE 204 IF RETURNING NOTHING IN BODY RESPONSE

exports.add = (req, res, next) => {
	// Account.aggregate([{$unwind: "$friendships"}, {$match: {uniqid: req.header("u"), "friendships.friend": req.body.receiver, "friendships.is_sender": true}}], (err, account) => {
	// 	if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
	// 	if(account.length !== 0) { return res.status(409).send({message: {user: "Cannot accept your own request"}});  }

	// 	Account.aggregate([{$unwind: "$friendships"}, {$match: {uniqid: req.body.receiver, "friendships.friend": req.header("u"), "friendships.is_accepted": true}}], (err, account) => {            
	// 		if(err) { console.log(err); res.status(500).send({ message: { database: "Internal error" }}); }
	// 		if(account.length !== 0) { return res.status(403).send({message: {user: "Request does not exist"}}); }

	// 		Account.updateMany({uniqid: [req.body.receiver, req.header("u")], "friendships._id": account.friendships[0]._id}, { $pull: { "friendships": { "_id": account.friendships[0]._id} } }, (err, account) => {
	// 			if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
	// 			if(!account) { return res.status(403).send({message: {user: "Friendship request does not exist"}}); }

	// 			return res.status(200).send({message: {friendship: "You do not accepted the request"}});
	// 		});
	// 	});
	// });
	Account.findOne({$and: [{"friendships._id": req.params.uniqid}, {uniqid: {$ne: req.header("u")}}]}, (err, account) => {
		if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if (!account) { return res.status(403).send({ message: { user: "Friendship request does not exist" } }); }
	
		Account.updateMany({ uniqid: [account.uniqid, req.header("u")], "friendships._id": req.params.uniqid }, { $pull: { "friendships": { "_id": req.params.uniqid } } }, (err, account) => {
			if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
			if (!account) { return res.status(403).send({ message: { user: "Friendship request does not exist" } }); }
	
			return res.status(200).send({ message: { friendship: "You do not accepted the request" } });
		});
	});
};

exports.publish = (req, res, next) => {
	Account.findOneAndUpdate({uniqid: req.header("u")}, {$pull: {"posts": {"uniqid": req.params.uniqid}}}, (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {post: "Post does not exists"}}); }

		return res.status(200).send({message: {post: "Post deleted"}});
	});
};

exports.like = (req, res, next) => {
	Account.findOne({"posts.uniqid": req.params.post}, {_id: 0, posts: 1}, (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {user: "Post does not exists"}}); }
	
		let postIndex = Account.getIndexByUniqid(account.posts, req.params.post);
		let queryProperty = `posts.${postIndex}`;
	
		if(req.params.comment) {
			let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, req.params.comment);
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
		
			return res.status(200).send({message: {like: "Disliked"}});
		});
	});
};