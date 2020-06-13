let Account = require("../models/account"), { getIndexByUniqid } = require("../lib");

exports.post = async (req, res, next) => {
	try {
		// CHECK IF RECEIVER EXISTS
		let receiver = await Account.findOne({ uniqid: req.params.uniqid }, { _id: 0, friendships: 1 }, { lean: true });
		if (!receiver) return res.status(404).send({ message: { user: "This user does not exists" } });

		// CHECK IF THE USER IS ALREADY A FRIEND OR THE SAME USER
		let pipelines = [{
			$match: {uniqid: req.params.uniqid}
		}, {
			$project: {
				_id: 0, 
				isFriend: { $cond: { if: { $in: [req.header("u"), "$friendships.friend"] }, then: true, else: false } }, 
				hasPendingRequest: { $cond: { if: { $and: [{ $in: [req.header("u"), "$friendships.friend"] }, { $eq: ["$friendships.is_accepted", false] }] }, "then": true, "else": false } }
			}
		}];

		let friendshipRequest = await Account.aggregate(pipelines);
		let { isFriend, hasPendingRequest } = friendshipRequest[0];

		if(isFriend || hasPendingRequest || req.header("u") === req.params.uniqid) return res.status(422).send({ message: { friendship: "Cannot send a friendship request to this user" } });

		// SET FRIENDSHIP OBJECTS
		let id = Account.setUniqid("user");
		let sended_at = new Date();
    
		let senderFriendship = {
			uniqid: id,
			is_sender: true,
			friend: req.params.uniqid,
			created_at: sended_at
		};

		let receiverFriendship = {
			uniqid: id,
			is_sender: false,
			friend: req.header("u"),
			created_at: sended_at
		};

		// SAVE FRIENDSHIPS
		receiver = await Account.findOneAndUpdate({ uniqid: req.params.uniqid }, { $push: { friendships: receiverFriendship } }, { new: true, setDefaultsOnInsert: true, lean: true });
		if (!receiver) return res.status(422).send({ message: { friendship: "Cannot send a friendship request for the user" } });

		let sender = await Account.findOneAndUpdate({ uniqid: req.header("u") }, { $push: { friendships: senderFriendship } }, { new: true, setDefaultsOnInsert: true, lean: true });
		if (!sender) return res.status(422).send({ message: { friendship: "Cannot send a friendship request for the user" } });

		return res.status(201).send({ message: { friendship: "Friendship request sended" } });
	
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
	
};

exports.patch = async (req, res, next) => {
	try {
		// CHECK IF REQUEST EXISTS
		let receiver = await Account.findOne({ uniqid: req.header("u"), "friendships.uniqid": req.params.uniqid, "friendships.is_sender": false}, { _id: 0, friendships: 1 }, { lean: true });
		if (!receiver) return res.status(404).send({ message: { request: "This request does not exists" } });

		let querySet = { ["friendships.$.is_accepted"]: true };
		let queryUnset = { ["friendships.$.is_sender"]: "" };

		// UPDATE REQUEST
		let request = await Account.updateMany({ "friendships.uniqid": req.params.uniqid }, { $set: querySet, $unset: queryUnset }, { runValidators: true, new: true, lean: true });
		if (request.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot accept this friendship request" } });

		return res.status(201).send({ message: { friendship: "Now you are friends" } });

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
	}
};

exports.delete = async (req, res, next) => {
	try {
		// CHECK IF REQUEST EXISTS
		let request = await Account.findOne({ uniqid: req.header("u"), "friendships.uniqid": req.params.uniqid, "friendships.is_sender": false}, { _id: 0, friendships: { $elemMatch: { uniqid: req.params.uniqid } } }, { lean: true });
		if (!request) return res.status(404).send({ message: { request: "This request does not exists" } });

		// UPDATE REQUEST
		request = await Account.updateMany({ "friendships.uniqid": req.params.uniqid }, { $pull: { "friendships": { "uniqid": req.params.uniqid } } }, { runValidators: true, lean: true, new: true });
		if (!request) return res.status(422).send({ message: { friendship: "Cannot refuse this friendship request" } });

		return res.status(204).send();

	} catch (err) {
		console.log(err); return console.log({ message: { database: "Internal error" } });
	}
};