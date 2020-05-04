let Account = require("../models/account"), passport = require("passport"), strategy = require("../strategies");

passport.use(strategy.signin);
passport.use(strategy.jwt);

exports.jwt = (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (err, account, info) => {
        
		if(err) { return res.status(500).send(err); }
		if(!account) { return res.status(401).send(info); }
        
		return next();
	})(req, res, next);
};

exports.signup = (req, res, next) => {
	Account.findOne({email: req.body.email}, (err, account) =>{
        
		if(err) { return console.log(err); }
		if(account) { return res.status(409).send({message: {email: "User already exists"}}); }
        
		new Account({
			uniqid: Account.setUniqid("user"),
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			gender: req.body.gender,
			birthday: new Date(req.body.birthday),
			hash: Account.setHash(req.body.hash)
		}).save(null, (err, account) => {
			if(err){ return console.log(err); }
		});
        
		return res.status(201).send({message: {user: "You are now part of the community"}});
	});
};

exports.local = (req, res, next) => {
	passport.authenticate("local", { session: false }, (err, account, info) => {
        
		if(err) { return res.status(500).send(err); }
		if(!account) { return res.status(401).send(info); }
        
		return res.status(201).send(info);
	})(req,res,next);
};

exports.add = (req, res, next) => {
	if(req.body.sender === req.body.receiver) res.status(409).send({message: {request: "You cannot send yourself a friendship request"}});
    
	let id = Account.setUniqid("user");
	let sended_at = new Date();
    
	let senderFriendship = {
			_id: id,
			is_sender: true,
			friend: req.body.receiver,
			created_at: sended_at
		},
		receiverFriendship = {
			_id: id,
			is_sender: false,
			friend: req.body.sender,
			created_at: sended_at
		};
    
	Account.find({$and: [{uniqid: {$in: [req.body.receiver, req.body.sender]}}, {"friendships.friend": {$in: [req.body.receiver, req.body.sender]}}]}, (err, accounts) => {
        
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(accounts.length !== 0) { return res.status(403).send({message: {user: "Already sended a friendship request to this user"}}); }
        
		Account.findOneAndUpdate({uniqid: req.body.receiver}, {$push: {friendships: receiverFriendship}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {user: "User does not exist"}}); }
            
			Account.findOneAndUpdate({uniqid: req.body.sender}, {$push: {friendships: senderFriendship}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
                
				if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
				if(!account) { return res.status(403).send({message: {user: "User does not exist"}}); }
                
				return res.status(201).send({message: {friendship: "You sended a friendship request"}});
			});
		});
	});
};

exports.publish = (req, res, next) => {
	let post = {
		uniqid: Account.setUniqid("post"),
		content: req.body.content,
		name: req.body.name
	};
    
	Account.findOneAndUpdate({uniqid: req.body.uniqid}, {$push: {posts: post}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
        
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {user: "User does not exist"}}); }
        
		let index = account.posts.length - 1;
		return res.status(201).send(account.posts[index]);
	});
};

exports.comment = (req, res, next) => {
	// FIND POSTER AND POST
	Account.findOne({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { _id: 0, uniqid: 1 }, (err, account) => {
		if (err) { return res.status(500).send(err); }
		if (!account) { return res.status(403).send({ message: { post: "This post does not exists" } }); }
        
		//FIND SENDER
		Account.findOne({ uniqid: req.body.sender.uniqid }, { _id: 0, uniqid: 1 }, (err, account) => {
			if (err) { return res.status(500).send(err); }
			if (!account) { return res.status(403).send({ message: { user: "This user does not exists" } }); }
            
			let comment = {
				uniqid: Account.setUniqid("post"),
				content: req.body.sender.content,
				user: req.body.sender.uniqid,
				name: req.body.sender.name
			};
            
			if (req.params.type === undefined) {
				Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (!account) { return res.status(403).send({ message: { comment: "Cannot comment" } }); }
                    
					let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post);
					let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);
                    
					return res.status(201).send(account.posts[postIndex].comments[commentIndex]);
				});
			} else if(req.params.type === "reply") {
				let replyMetadata = {
					user: req.body.commentator.uniqid,
					name: req.body.commentator.name,
					comment: req.body.commentator.comment
				};
                
				comment.is_reply = true;
				comment.replyMetadata = replyMetadata;
                
				Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.comments.uniqid": req.body.commentator.comment, "posts.comment.user": req.body.commentator.uniqid } },
					{
						$project: {
							uniqid: 1,
							_id: 0
						}
					}], (err, account) => {
					if (err) { return res.status(500).send(err); }
					if (account.length === 0) { return res.status(403).send({ message: { comment: "Comment does not exists" } }); }
                    
					Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
						if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
						if (!account) { return res.status(403).send({ message: { cooment: "Cannot comment" } }); }
                        
						let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post);
						let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);
                        
						return res.status(201).send(account.posts[postIndex].comments[commentIndex]);
					});
				});
			}else{
				next();
			}
		});
	});
};

exports.like = (req, res, next) => {
	// FIND POSTER AND POST
	Account.findOne({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { _id: 0, uniqid: 1, posts: 1 }, (err, account) => {
		if (err) { return res.status(500).send({ message: { database: "Internal error" } }); }
		if (!account) { return res.status(403).send({ message: { post: "This post does not exists" } }); }
        
		let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post);
        
		//FIND SENDER
		Account.findOne({ uniqid: req.body.sender.uniqid }, { _id: 0, uniqid: 1 }, (err, account) => {
			if (err) { return res.status(500).send(err); }
			if (!account) { return res.status(403).send({ message: { user: "This user does not exists" } }); }
            
			let like = {
				user: req.body.sender.uniqid,
				name: req.body.sender.name
			};
            
			if (req.params.type === "post") {
				Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.body.poster.post, "posts.likes.user": {$ne: req.body.sender.uniqid}} },
					{
						$project: {
							uniqid: 1,
							_id: 0
						}
					}], (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (account.length === 0) { return res.status(409).send({ message: { like: "You already liked this post" } }); }
                
					Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post, }, { $push: { "posts.$.likes": like } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
						if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
						if (!account) { return res.status(403).send({ message: { like: "Cannot like" } }); }
                        
						let likeIndex = Account.getIndexByUniqid(account.posts[postIndex].likes, like.uniqid);
                        
						return res.status(201).send(account.posts[postIndex].likes[likeIndex]);
					});
				});
			} else if (req.params.type === "comment") {
				Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.body.poster.post, "posts.comments.uniqid": req.body.poster.comment, "posts.comments.likes.user": {$ne: req.body.sender.uniqid}} },
					{
						$project: {
							uniqid: 1,
							_id: 0
						}
					}], (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (account.length === 0) { return res.status(409).send({ message: { like: "You already liked this comment" } }); }

					Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.body.poster.post } },
						{
							$project: {
								posts: 1,
								_id: 0
							}
						}], (err, account) => {
						if (err) { return res.status(500).send({ message: { database: "Internal error" } }); }
						if (account.length === 0) { return res.status(403).send({ message: { post: "Post does not exists" } }); }
                    
						let post = account.map(account => account.posts)[0];
                    
						let commentIndex = Account.getIndexByUniqid(post.comments, req.body.poster.comment);
                    
						let commentQuery = `posts.${postIndex}.comments.${commentIndex}.likes`;
						let postQuery = `posts.${postIndex}.comments.uniqid`;

						if(commentIndex !== -1){
							Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, [postQuery]: req.body.poster.comment }, { $push: { [commentQuery]: like } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
								if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
								if (!account) { return res.status(403).send({ message: { comment: "Cannot like" } }); }
                            
								let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, req.body.poster.comment);
								let likeIndex = Account.getIndexByUniqid(account.posts[postIndex].comments[commentIndex].likes, like.uniqid);
                            
								return res.status(201).send(account.posts[postIndex].comments[commentIndex].likes[likeIndex]);                    
							});
						}else{
							return res.status(403).send({ message: { comment: "Comment does not exists" } });
						}
					});
				});
			} else {
				next();
			}
		});
	});
};

exports.share = (req, res, next) => {
    
	let shared_at = new Date();
    
	let shareMetadata = {
			user: req.body.poster.uniqid,
			name: req.body.poster.name,
			post: req.body.poster.post
		},
		post = {
			uniqid: Account.setUniqid("post"),
			name: req.body.sender.name,
			is_share: true,
			content: req.body.sender.content,
			shareMetadata: shareMetadata,
			created_at: shared_at
		},
		share = {
			user: req.body.sender.uniqid,
			name: req.body.sender.name,
			post: post.uniqid,
			created_at: shared_at
		};
    
	Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post}, {$push: {"posts.$.shares": share}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {user: "Post or user does not exist"}}); }
        
		let index = Account.getIndexByUniqid(account.posts, req.body.poster.post),
			original = account.posts[index];
        
		Account.findOneAndUpdate({uniqid: req.body.sender.uniqid}, {$push: {"posts": post}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
            
			let index = account.posts.length - 1;
            
			return res.status(201).send({share: account.posts[index], original: original});
		});
	});
};