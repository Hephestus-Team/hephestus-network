let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// GET USER
		let user = res.locals.user;

		// CHECK IF THE USER IS ALREADY A FRIEND OR THE SAME USER
		let pipelines = [{
			$match: { uniqid: user.uniqid }
		}, {
			$project: {
				_id: 0, 
				isFriend: { $cond: { if: { $in: [req.header("u"), "$friendships.friend"] }, then: true, else: false } }, 
				hasPendingRequest: { $cond: { if: { $and: [{ $in: [req.header("u"), "$friendships.friend"] }, { $eq: ["$friendships.is_accepted", false] }] }, "then": true, "else": false } }
			}
		}];

		let friendshipRequest = await Account.aggregate(pipelines);
		let { isFriend, hasPendingRequest } = friendshipRequest[0];

		if(isFriend || hasPendingRequest || req.header("u") === user.uniqid) return res.status(409).send({ message: { friendship: "Cannot send a friendship request to this user" } });

		// SET FRIENDSHIP OBJECTS
		let id = Account.setUniqid("user");
		let sended_at = new Date();
    
		let senderFriendship = {
			uniqid: id,
			is_sender: true,
			friend: user.uniqid,
			created_at: sended_at
		};

		let receiverFriendship = {
			uniqid: id,
			is_sender: false,
			friend: req.header("u"),
			created_at: sended_at
		};

		// SAVE FRIENDSHIPS
		let receiver = await Account.findOneAndUpdate({ uniqid: user.uniqid }, { $push: { friendships: receiverFriendship } }, { new: true, setDefaultsOnInsert: true, lean: true });
		if (receiver.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot send a friendship request for the user" } });

		let sender = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { friendships: senderFriendship } }, { new: true, setDefaultsOnInsert: true, lean: true });
		if (sender.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot send a friendship request for the user" } });

		return res.status(201).send({ message: { friendship: "Friendship request sended" } });
	
	} catch (err) {
		next(err);
	}
	
};

exports.patch = async (req, res, next) => {
	try {
		// GET USER
		let user = res.locals.user;

		// GET FRIENDSHIP UNIQID
		let friendship = await Account.findOne({ $and: [{ uniqid: req.header("u") }, { "friendships.friend": user.uniqid }] }, { _id: 0, "friendships.$": 1 }, { lean: true });
		if (!friendship) return res.status(404).send({ message: { request: "This friendship request does not exists" } });
		friendship = friendship.friendships[0];

		let querySet = { ["friendships.$.is_accepted"]: true };
		let queryUnset = { ["friendships.$.is_sender"]: "" };

		// UPDATE REQUEST
		let request = await Account.updateMany({ "friendships.uniqid": friendship.uniqid }, { $set: querySet, $unset: queryUnset }, { runValidators: true, new: true, lean: true });
		if (request.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot accept this friendship request" } });

		return res.status(201).send({ message: { friendship: "Now you are friends" } });

	} catch (err) {
		next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		// GET USER
		let user = res.locals.user;

		// GET FRIENDSHIP UNIQID
		let friendship = await Account.findOne({ $and: [{ uniqid: user.uniqid }, { "friendships.friend": req.header("u") }] }, { _id: 0, "friendships.$": 1 }, { lean: true });
		if (!friendship) return res.status(404).send({ message: { request: "This friendship request does not exists" } });
		friendship = friendship.friendships[0];

		// UPDATE REQUEST
		let request = await Account.updateMany({ "friendships.uniqid": friendship.uniqid }, { $pull: { "friendships": { "uniqid": friendship.uniqid } } }, { runValidators: false, lean: true, new: true });
		if (request.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot refuse this friendship request" } });

		return res.status(204).send();

	} catch (err) {
		next(err);
	}
};