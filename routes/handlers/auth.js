const { Logins, Users, Posts, Friendships } = require("../../collections");

exports.signup = async (req, res, next) => {
	try {

		// CHECK IF EMAIL IS ALREADY REGISTRED
		let userAlreadyExists = await Logins.findOne({ email: req.body.email }, { lean: true });
		if (userAlreadyExists) return res.status(409).send({ message: { email: "User already exists" } });

		let user = new Users({
			uniqid: Users.uniqid(),
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			gender: req.body.gender,
			birthday: new Date(req.body.birthday)
		});

		let login = new Logins({
			uniqid: user.uniqid,
			email: req.body.email,
			hash: req.body.hash
		});

		// SAVE USER IN USERS AND LOGINS COLLECTION
		await user.save();
		await login.save();

		return res.status(201).send({ message: { user: "You are now part of the community" } });

	} catch (err) {
		return next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		// CHECK IF EMAIL EXISTS IN LOGINS COLLECTION
		let user = await Logins.findOne({ email: req.body.email }, { _id: 0, hash: 1, uniqid: 1 }, { lean: true });
		if (!user) return res.status(401).send({ message: { email: "This user does not exists" } });

		// CHECK IF THE PASSWORD MATCHES
		if (!Logins.checkPassword(req.body.hash, user["hash"])) return res.status(401).send({ message: { password: "Wrong password" } });

		// GET LOGIN OBJ
		let login = await Users.getUser(user["uniqid"], { parseFriendships: 1, setJWT: 1 });

		return res.status(200).send(login);

	} catch (err) {
		return next(err);
	}
};