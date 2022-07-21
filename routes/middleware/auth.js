const { Logins, Users } = require("../../collections");

module.exports = async (req, res, next) => {
	try {
		// CHECK IF JWT IS CORRECT
		let jwtRegex = /^[Bearer ]+[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*$/;
		if(!req.header("Authorization") || !req.header("Authorization").match(jwtRegex)) return res.status(401).send({ message: { permission: "Invalid token" } });
		
		// CHECK JWT & UNIQID
		let jwtAndUniqidMatches = await Logins.checkJwt(req.header("Authorization"), req.header("u"));
		if (!jwtAndUniqidMatches) return res.status(401).send({ message: { permission: "Invalid token" } });

		// BUILD USER OBJ
		res.locals.user = await Users.getUser(req.header("u"), { parseFriendships: 1 });

		res.locals.params = {};

		return next();

	} catch (err) {
		return next(err);
	}
};