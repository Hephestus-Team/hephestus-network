let Account = require("../models/account");

exports.get = async (req, res, next) => {
	try {
		// VALIDATE Q PARAM
		if(!req.query.q || req.query.q <= 0) return res.status(400).send({ message: { query: "The limit must be a positive integer" } });

		// SET THE LIMIT AND THE FIXED VALUE FOR RETRIEVING POSTS
		let profile = await Account.findOne({ uniqid: req.params.uniqid }, { _id: 0, posts: 1 }, { lean: true });
		if (!profile) return res.status(404).send({ message: { profile: "This user does not exists" } });

		let fixedQuantity = 4, limit = { bottomLimit: 0, fixedQuantity: fixedQuantity }, hasMorePosts = true;

		// IF REQUESTING MORE THAN 4 POSTS, GET THE 4 POSTS AFTER LENGTH - (QUERY * 4)
		// ELSE GET THE LAST 4 POSTS
		if(req.query.q === 1) limit.bottomLimit = -fixedQuantity;
		else if(req.query.q > 1) limit.bottomLimit = profile.posts.length - req.query.q * fixedQuantity;

		if(profile.posts.length <= req.query.q * fixedQuantity) hasMorePosts = false;
		
		// GET PROFILE-USER RELATIONSHIP
		let { profileIsPublic, relationship } = await Account.getRelationship(req.params.uniqid, req.header("u"));

		// GET POSTS ARRAY
		let posts = await Account.parsePosts(req.params.uniqid, req.header("u"), relationship, limit);
		
		return res.status(200).send({posts, hasMorePosts});

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}
};