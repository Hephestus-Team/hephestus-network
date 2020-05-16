let Account = require("../models/account");

exports.profile = (req, res, next) => {
	let self_profile = Boolean(req.header("u") === req.params.uniqid || (req.params.uniqid === undefined && req.header("u")));

	if(self_profile){
		Account.getProfile(Account, { $or: [ { uniqid: {$in: [req.params.uniqid, req.header("u")]} }, { username: req.params.uniqid } ] }, req.header("u"), (err, account) => {
			if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
			if (!account) { return res.status(404).send({ message: { user: "User does not exist" } }); }
            
			account.is_friend = false;
			account.is_user = true;

			return res.status(200).send(account);
		});

	}else{
		Account.findOne({$or: [{uniqid: req.params.uniqid}, {username: req.params.uniqid}]}, (err, account) => {
			if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" }}); }
			if(!account) { return res.status(404).send({ message: { user: "User does not exist" } }); }
            
			let is_friend = Boolean(account.friendships.find(friendship => friendship.friend === req.header("u")));

			if(is_friend) {
				Account.getProfile(Account, { $or: [ { uniqid: {$eq: req.params.uniqid} }, { username: req.params.uniqid } ] }, req.header("u"), (err, account) => {
					if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if (!account) { return res.status(404).send({ message: { user: "User does not exist" } }); }
                    
					account.is_friend = true;
                    
					return res.status(200).send(account);
				});

			}else{
				Account.getProfile(Account, { $or: [ { uniqid: {$eq: req.params.uniqid} }, { username: req.params.uniqid } ] }, req.header("u"), (err, account) => {
					if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
					if(!account) { return res.status(404).send({ message: { user: "User does not exist" } }); }

					account.is_friend = false;
					account.is_user = false;

					return res.status(200).send(account);
				});
			}
		});
	}
};

exports.publish = (req, res, next) => {
	//uniqid post
	Account.aggregate([{$unwind: "$posts"}, {$match: {"posts.uniqid": req.params.uniqid}}, {
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
				$cond: {if: {$eq: ["$posts.likes.user", req.header("u")]}, then: true, else: false}
			},
			_id: 0
		}
	}], (err, account) => {
		if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: "Internal error" } }); }
		if(account.length === 0) { return res.status(404).send({ message: { post: "Post does not exists" } }); }

		let posts = account.map((account => account.posts));
		let post = posts[0];
		post.is_poster = (account[0].uniqid === req.header("u")) ? true : false;
		post.user = account[0].uniqid;

		return res.status(200).send(post);
	});
};