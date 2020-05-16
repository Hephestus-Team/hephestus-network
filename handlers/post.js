let Account = require("../models/account"), passport = require("passport"), strategy = require("../strategies");

passport.use(strategy.signin);
passport.use(strategy.jwt);

exports.uniqid = (req, res, next) => {
	let _id = Account.getJwtPayload(req.header("Authorization"));
	Account.findOne({$and: [{_id: _id}, {uniqid: req.header("u")}]}, (err, account) => {
		if(err) { return res.status(500).send({message: {database: "Internal error"}}); }
		if(!account) { return res.status(401).send({message: {user: "Cannot perform this action"}}); }

		return next();
	});
};

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
        
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if(!account) { return res.status(401).send(info); }
        
		return res.status(201).send(info);
	})(req,res,next);
};

exports.add = (req, res, next) => {
	if(req.header("u") === req.body.receiver) res.status(409).send({message: {request: "You cannot send yourself a friendship request"}});
    
	let id = Account.setUniqid("user");
	let sended_at = new Date();
    
	let senderFriendship = {
			uniqid: id,
			is_sender: true,
			friend: req.body.receiver,
			created_at: sended_at
		},
		receiverFriendship = {
			uniqid: id,
			is_sender: false,
			friend: req.header("u"),
			created_at: sended_at
		};
    
	Account.find({$and: [{uniqid: {$in: [req.body.receiver, req.header("u")]}}, {"friendships.friend": {$in: [req.body.receiver, req.header("u")]}}]}, (err, accounts) => {
        
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(accounts.length !== 0) { return res.status(403).send({message: {user: "Already sended a friendship request to this user"}}); }
        
		Account.findOneAndUpdate({uniqid: req.body.receiver}, {$push: {friendships: receiverFriendship}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(403).send({message: {user: "User does not exist"}}); }
            
			Account.findOneAndUpdate({uniqid: req.header("u")}, {$push: {friendships: senderFriendship}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
                
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

	Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { posts: post } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
		if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if (!account) { return res.status(403).send({ message: { post: "Cannot post" } }); }

		let postIndex = Account.getIndexByUniqid(account.posts, post.uniqid);
		return res.status(200).send(account.posts[postIndex]);
	});
};

exports.comment = (req, res, next) => {
	// FIND POSTER AND POST
	Account.findOne({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { _id: 0, uniqid: 1 }, (err, account) => {
		if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if (!account) { return res.status(403).send({ message: { post: "This post does not exists" } }); }
        
		//FIND SENDER
		Account.findOne({ uniqid: req.header("u") }, { _id: 0, uniqid: 1 }, (err, account) => {
			if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
			if (!account) { return res.status(403).send({ message: { user: "This user does not exists" } }); }
            
			let comment = {
				uniqid: Account.setUniqid("post"),
				content: req.body.sender.content,
				user: req.header("u"),
				name: req.body.sender.name
			};
            
			if (req.params.type === undefined) {
				//SAVE COMMENT
				Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (!account) { return res.status(403).send({ message: { comment: "Cannot comment" } }); }
                    
					let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post);
					let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);
                    
					return res.status(200).send(account.posts[postIndex].comments[commentIndex]);
				});
			} else if(req.params.type === "reply") {
				let replyMetadata = {
					user: req.body.commentator.uniqid,
					name: req.body.commentator.name,
					comment: req.body.commentator.comment
				};
                
				comment.is_reply = true;
				comment.replyMetadata = replyMetadata;
				
				//FIND COMMENT
				Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.comments.uniqid": req.body.commentator.comment, "posts.comments.user": req.body.commentator.uniqid } },
					{
						$project: {
							uniqid: 1,
							_id: 0
						}
					}], (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (account.length === 0) { return res.status(403).send({ message: { comment: "Comment does not exists" } }); }
					
					//SAVE REPLY
					Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post }, { $push: { "posts.$.comments": comment } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
						if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
						if (!account) { return res.status(403).send({ message: { comment: "Cannot comment" } }); }
                        
						let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post);
						let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, comment.uniqid);
                        
						return res.status(200).send(account.posts[postIndex].comments[commentIndex]);
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
		if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if (!account) { return res.status(403).send({ message: { post: "This post does not exists" } }); }
        
		let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post);
        
		//FIND SENDER
		Account.findOne({ uniqid: req.header("u") }, { _id: 0, uniqid: 1 }, (err, account) => {
			if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
			if (!account) { return res.status(403).send({ message: { user: "This user does not exists" } }); }
            
			let like = {
				user: req.header("u"),
				name: req.body.sender.name
			};
            
			if (req.params.type === "post") {
				//CHECK IF USER ALREADY LIKED THE POST
				Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.body.poster.post, "posts.likes.user": req.header("u")} },
					{
						$project: {
							uniqid: 1,
							_id: 0
						}
					}], (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (account.length !== 0) { return res.status(409).send({ message: { like: "You already liked this post" } }); }
					
					//SAVE LIKE
					Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post, }, { $push: { "posts.$.likes": like } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
						if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
						if (!account) { return res.status(403).send({ message: { like: "Cannot like" } }); }
                        
						return res.status(200).send(account.posts[postIndex]);
					});
				});
			} else if (req.params.type === "comment") {
				//CHECK IF USER ALREADY LIKED THE COMMENT
				Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.body.poster.post, "posts.comments.uniqid": req.body.commentator.comment, "posts.comments.likes.user": req.header("u")} },
					{
						$project: {
							uniqid: 1,
							_id: 0
						}
					}], (err, account) => {
					if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (account.length !== 0) { return res.status(409).send({ message: { like: "You already liked this comment" } }); }
					
					//RETRIEVE POST
					Account.aggregate([{ $unwind: "$posts" }, { $match: { "posts.uniqid": req.body.poster.post } },
						{
							$project: {
								posts: 1,
								_id: 0
							}
						}], (err, account) => {
						if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
						if (account.length === 0) { return res.status(403).send({ message: { post: "Post does not exists" } }); }
                    
						let post = account.map(account => account.posts)[0];
                    
						let commentIndex = Account.getIndexByUniqid(post.comments, req.body.commentator.comment);
                    
						let commentQuery = `posts.${postIndex}.comments.${commentIndex}.likes`;
						let postQuery = `posts.${postIndex}.comments.uniqid`;

						if(commentIndex !== -1){

							//SAVE LIKE
							Account.findOneAndUpdate({ uniqid: req.body.poster.uniqid, [postQuery]: req.body.poster.comment }, { $push: { [commentQuery]: like } }, { new: true, setDefaultsOnInsert: true }, (err, account) => {
								if (err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
								if (!account) { return res.status(403).send({ message: { comment: "Cannot like" } }); }
                            
								let commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, req.body.commentator.comment);
                            
								return res.status(200).send(account.posts[postIndex].comments[commentIndex]);                           
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
			user: req.header("u"),
			name: req.body.sender.name,
			post: post.uniqid,
			created_at: shared_at
		};
	//SAVE SHARE IN ORIGINAL
	Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post}, {$push: {"posts.$.shares": share}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
		if(!account) { return res.status(403).send({message: {user: "This post does not exist"}}); }
        
		let postIndex = Account.getIndexByUniqid(account.posts, req.body.poster.post),
			original = account.posts[postIndex];
		//SAVE POST
		Account.findOneAndUpdate({uniqid: req.header("u")}, {$push: {"posts": post}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
			if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" }}); }
            
			let postIndex = Account.getIndexByUniqid(account.posts, post.uniqid);
            
			return res.status(200).send({share: account.posts[postIndex], original: original});
		});
	});
};