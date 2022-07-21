const { Logins, Users, Posts, Friendships } = require("../../collections");

exports.send = async (req, res, next) => {
	try {

		// GET USER DATA
		let receiver = res.locals.params["user"];
		let user = res.locals.user;

		// CHECK IF THE RECEIVER IS ALREADY A FRIEND OR IS THE SAME USER
		let requestExists = await Friendships.findOne({ users: [user["uniqid"], receiver["uniqid"]] }, { lean: true });

		if(requestExists || user["uniqid"] === receiver["uniqid"]){
			return res.status(409).send({ message: { friendship: "Cannot send a friendship request to this user" } });
		}

		// BUILD THE FRIENDSHIP OBJECT
		let friendship = new Friendships({
			users: [user["uniqid"], receiver["uniqid"]],
			names: [user["name"], receiver["name"]]
		});

		// SAVE FRIENDSHIP
		await friendship.save();

		return res.status(201).send({ message: { friendship: "Friendship request sended" } });
	
	} catch (err) {
		return next(err);
	}
	
};

exports.accept = async (req, res, next) => {
	try {

		// GET USER & FRIENDSHIP DATA
		let friendship = res.locals.params["friendship"];
		let user = res.locals.user;

		// CHECK IF USER IS THE SENDER
		let isSender = Boolean(user["uniqid"] === friendship["users"][0]);

		if (isSender) return res.status(409).send({ message: { request: "Cannot accept a sended request" } });

		// UPDATE FRIENDSHIP
		let friendshipUpdated = await Friendships.findOneAndUpdate({ uniqid: friendship["uniqid"] }, { $set: { is_accepted: true } }, { runValidators: true, lean: true, new: true });
		if (!friendshipUpdated) return res.status(422).send({ message: { friendship: "Cannot accept this friendship request" } });

		return res.status(201).send({ message: { friendship: "Now you are friends" } });

	} catch (err) {
		return next(err);
	}
};

exports.refuse = async (req, res, next) => {
	try {

		// GET USER & FRIENDSHIP DATA
		let friendship = res.locals.params["friendship"];
		let user = res.locals.user;

		// CHECK IF USER IS A FRIEND
		let isFriend = await Friendships.findOne({ uniqid: friendship["uniqid"], users: user["uniqid"] }, { lean: true });
		if (!isFriend) return res.status(409).send({ message: { friendship: "Cannot delete this friendship" } });

		// DELETE FRIENDSHIP
		let friendshipDeleted = await Friendships.findOneAndDelete({ uniqid: friendship["uniqid"] });
		if (!friendshipDeleted) return res.status(422).send({ message: { friendship: "Cannot delete this friendship" } });

		return res.status(204).send();

	} catch (err) {
		return next(err);
	}
};