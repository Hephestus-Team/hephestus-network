let functions = {
	parseFriendships: async function(friendships){

		let friends_uniqid = [];
		var friends = [];
	
		friendships.forEach((friendship, index, friendships) => {
			friends_uniqid.push(friendship.friend);
		});
	
		let accounts;
	
		try {
			accounts = await this.find({uniqid: {$in: friends_uniqid}}, {_id: 0, first_name: 1, last_name: 1}, {lean: true, sort: { "friendships.created_at": 1 }});
		} catch (err) {
			throw new Error(err);
		}
	
		accounts.forEach((account, index, accounts) => {
			friends.push({
				uniqid: account.uniqid,
				name: `${account.first_name} ${account.last_name}`
			});
		});
	
		return friends;
	},
	parsePosts: function(profile, user, cb){
		//GET PROFILE'S POSTS UNIQID
		this.findOne({uniqid: profile}, {_id: 0}, function(err, account){
			if(err) { return cb(err, null); }
			
			let posts = account.posts.map(post => post.uniqid);
			let query;
	
			if(user.relationship === 1) {
				query = {
					uniqid: account.uniqid, 
					"posts.uniqid": {$in: posts}, 
				};
			}else{
				query = {
					uniqid: account.uniqid, 
					"posts.uniqid": {$in: posts}, 
					// "posts.visibility": user.relationship
				};
			}	
		
			//FILTER POSTS BY VISIBILITY, IF SHARE, ASSIGNS ORIGINAL PROPERTY THE ORIGINAL POST UNIQID
			this.aggregate([{$unwind: "$posts" }, {$match: query}, 
				{
					$project: {
						"posts.uniqid": 1,
						"posts.content": 1,
						"posts.original": {
							$cond: {if: {$eq: ["$posts.is_share", true]}, then: "$posts.shareMetadata.post", else: false}
						},
						"posts.created_at": 1,
						"posts.visibility": 1,
						"posts.is_share": 1,
						"posts.name": 1,
						"posts.shares": 1,
						"posts.likes": 1,
						"posts.comments": 1,
						"posts.is_liked": {
							$cond: {if: {$eq: ["$posts.likes.user", user]}, then: true, else: false}
						},
						"posts.poster": account.uniqid,
						_id: 0
					}
				}, {$sort: { "posts.original": 1 } }], function(err, accounts){
				if(err) { return cb(err, null); }
				if(accounts.length === 0) { return cb(null, null); }
		
				let posts = accounts.map(account => account.posts);
	
				//GET ONLY SHARES
				let shares = posts.filter(post => post.is_share);
	
				//GET ALL POSTS THAT IS NOT A SHARE
				posts = posts.filter(post => !post.is_share);
	
				//GET ORIGINAL POSTS
				this.aggregate([{$unwind: "$posts" }, {$match: {"posts.uniqid": {$in: shares.map(share => share.original)}}}, 
					{
						$project: {
							"posts.uniqid": 1,
							"posts.content": 1,
							"posts.name": 1,
							_id: 0
						}
					}, {$sort: { "posts.uniqid": 1 } }], function(err, originals){
					if(err) { return cb(err, null); }
			
					originals = originals.map(original => original.posts);
		
					shares.forEach(share => {
						let original = originals.find(original => original.uniqid == share.original);
						delete share.original;
	
						share.original = (original !== undefined) ? original : false;
					});
		
					posts = posts.concat(shares);
		
					return cb(null, posts);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	},
	getProfile: function(operator, user, cb){
		/* 
			USER: {
				uniqid: user that is searching the profile,
				relationship: relationship between user x profile
			},
			PROFILE: profile uniqid
		*/
		this.findOne(operator, { hash: 0, created_at: 0, __v: 0, _id: 0, email: 0 }, { lean: true }, function(err, account){
			if (err) { return cb(err, null); }
			if (account.friendships.length === 0) {
				this.parsePosts(account.uniqid, user, function(err, posts){
					if (err) { cb(err, null); }
					delete account.posts;
					account.posts = posts;

					return cb(null, account);
				});
			} else {
				this.parsePosts(account.uniqid, user, async function(err, posts){
					if (err) { return cb(err, null); }

					let friendships;

					try {
						friendships = await this.parseFriendships(account.friendships);
					} catch (err) {
						return cb(err, null);
					}

					delete account.friendships;
					account.friendships = friendships;

					delete account.posts;
					account.posts = posts;

					return cb(null, account);
				}.bind(this));
			}
		}.bind(this));
	}
};

module.exports = {
	parseFriendships: functions["parseFriendships"],
	parsePosts: functions["parsePosts"],
	getProfile: functions["getProfile"],
};