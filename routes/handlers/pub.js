let Account = require("../../models/account");

exports.get = async (req, res, next) => {
	try {
		// GET ACCOUNT
		let user = res.locals.params["user"];

		// VALIDATE Q PARAM
		if(!req.query.q || Number(req.query.q) <= 0) return res.status(400).send({ message: { query: "The limit must be a positive integer" } });

		// SET THE LIMIT AND THE FIXED VALUE FOR RETRIEVING POSTS
		let fixedQuantity = 4, limit = { bottomLimit: 0, fixedQuantity: fixedQuantity }, hasMorePosts = true;

		// IF REQUESTING MORE THAN 4 POSTS, GET THE 4 POSTS AFTER LENGTH - (QUERY * 4)
		// ELSE GET THE LAST 4 POSTS
		if (Number(req.query.q) === 1) { limit.bottomLimit = user.posts.length - fixedQuantity; }
		else if (Number(req.query.q) > 1) { limit.bottomLimit = user.posts.length - Number(req.query.q) * fixedQuantity; }

		if(user.posts.length <= Number(req.query.q) * fixedQuantity) hasMorePosts = false;
		
		// GET PROFILE-USER RELATIONSHIP
		let { profileIsPublic, relationship } = await Account.getRelationship(user.uniqid, req.header("u"));

		// GET POSTS ARRAY
		let posts = await Account.parsePosts(user.uniqid, req.header("u"), relationship, limit);

		// SET HEADERS
		res.header({
			"hasMorePosts": hasMorePosts
		});

		return res.status(200).send(posts);

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}
};