let Account = require("../models/account");

// 201 IF RETURNING ONLY ID OR 200 IF RETURNING ENTIRE OBJ

exports.add = (req, res, next) => {
	Account.aggregate([{$unwind: "$friendships"}, {$match: {uniqid: req.header("u"), "friendships.friend": req.body.receiver, "friendships.is_sender": true}}], (err, account) => {
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(account.length !== 0) { return res.status(409).send({message: {user: "Cannot accept your own request"}});  }

		Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.header("u")}, (err, account) => {            
			if(err) { console.log(err); res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {user: "Request does not exist"}}); }

			Account.updateMany({uniqid: [req.body.receiver, req.header("u")], "friendships.uniqid": account.friendships[0].uniqid}, {$set: {"friendships.0.is_accepted": true}, $unset: {"friendships.0.is_sender": ""}}, (err, account) => {
				if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
				if(!account) { return res.status(403).send({message: {user: "Friendship request does not exist"}}); }

				return res.status(201).send({message: {friendship: "Now you are friends"}});
			});
		});
	});
};

exports.profile = (req, res, next) => {
	if(req.header("u") === req.params.uniqid || (req.params.uniqid === undefined && req.header("u")) ){
		
		let dictionary = ["bio", "username", "birthday", "first_name", "last_name", "visibility"];
		let properties = Object.getOwnPropertyNames(req.body.user);
		let keys_matches = true;

		properties.forEach((property) => {
			if(!(dictionary.includes(property))){
				keys_matches = false;
			}
		});

		if(keys_matches){
			Account.findOneAndUpdate({uniqid: req.header("u")}, req.body.user, {new: true}, (err, account) => {
            
				if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
				delete account._id, account.hash, account.email;

				return res.status(200).send(req.body.user);
			});
		}else{
			return res.status(400).send({message: {user: "You cannot change other information besides your bio, username or birthday"}});
		}
	}else{
		return res.status(401).send({message: {user: "You cannot change another user information"}});
	}
};

exports.publish = (req, res, next) => {
	Account.aggregate([{$unwind: "$posts"}, {$match: {uniqid: req.header("u"), "posts.uniqid": req.body.post.uniqid}}, {
		$project : { _id: 0, posts: 1}
	}], (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {post: "This post does not exists"}}); }

		let posts = account.map(account => {return {content: account.posts.content, modified_at: new Date()};});
		let old_post = posts[0];

		if(old_post.content === req.body.post.content) {
			return res.status(400).send({message: {post: "You do not change the post content"}});
		}

		Account.findOneAndUpdate({uniqid: req.header("u"), "posts.uniqid": req.body.post.uniqid}, {$set: {"posts.$.content": req.body.post.content}, $push: {"posts.$.history": old_post}}, {new: true}, (err, account) => {
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {post: "This post does not exists"}}); }
			
			let postIndex = Account.getIndexByUniqid(account.posts, req.body.post.uniqid);

			return res.status(200).send(account.posts[postIndex]);
		});
	});
};

exports.comment = (req, res, next) => {
	Account.aggregate([{$unwind: "$posts"}, {$match: {"posts.comments.uniqid": req.body.comment.uniqid, "posts.comments.user": req.header("u")}}, {
		$project: { 
			_id: 0,
			uniqid: 1,
			posts: 1
		} 
	}], (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(account.length === 0) { return res.status(403).send({message: {comment: "This comment does not exists"}}); }
	
		let post = account.map(account => account.posts)[0];
		let posterUniqid = account[0].uniqid;
		let commentIndex = Account.getIndexByUniqid(post.comments, req.body.comment.uniqid);
		let postIndex = "$";
	
		let queryContent = `posts.${postIndex}.comments.${commentIndex}.content`;
		let queryHistory = `posts.${postIndex}.comments.${commentIndex}.history`;
	
		let old_comment = { content: post.comments[commentIndex].content, modified_at: new Date() };

		if(old_comment.content === req.body.comment.content) {
			return res.status(400).send({message: {post: "You do not change the comment content"}});
		}

		Account.findOneAndUpdate({uniqid: posterUniqid, "posts.uniqid": req.body.post.uniqid}, {$set: {[queryContent]: req.body.comment.content}, $push: {[queryHistory]: old_comment}}, {new: true}, (err, account) => {
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {post: "This post does not exists"}}); }

			let postIndex = Account.getIndexByUniqid(account.posts, req.body.post.uniqid);
			let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, req.body.comment.uniqid);

			return res.status(200).send(account.posts[postIndex].comments[commentIndex]);
		});
	});
};