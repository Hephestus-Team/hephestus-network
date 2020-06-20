let Account = require("../../models/account");

exports.post = async (req, res, next) => {
	try {
		// GET USER
		let receiver = res.locals.params["user"];

		// CHECK IF THE USER IS ALREADY A FRIEND OR THE SAME USER
		let pipelines = [{
			$match: { uniqid: receiver.uniqid }
		}, {
			$project: {
				_id: 0, 
				isFriend: { $cond: { if: { $in: [res.locals.user["uniqid"], "$friendships.friend"] }, then: true, else: false } }, 
				hasPendingRequest: { $cond: { if: { $and: [{ $in: [res.locals.user["uniqid"], "$friendships.friend"] }, { $eq: ["$friendships.is_accepted", false] }] }, "then": true, "else": false } }
			}
		}];

		let friendshipRequest = await Account.aggregate(pipelines);
		let { isFriend, hasPendingRequest } = friendshipRequest[0];

		if(isFriend || hasPendingRequest || res.locals.user["uniqid"] === receiver.uniqid) return res.status(409).send({ message: { friendship: "Cannot send a friendship request to this user" } });

		// SET FRIENDSHIP OBJECTS
		let id = Account.setUniqid("user");
		let sended_at = new Date();
    
		let senderFriendship = {
			uniqid: id,
			is_sender: true,
			friend: receiver.uniqid,
			created_at: sended_at
		};

		let receiverFriendship = {
			uniqid: id,
			is_sender: false,
			friend: res.locals.user["uniqid"],
			created_at: sended_at
		};

		// SAVE FRIENDSHIPS
		let receiverAccount = await Account.findOneAndUpdate({ uniqid: receiver.uniqid }, { $push: { friendships: receiverFriendship } }, { new: true, setDefaultsOnInsert: true, lean: true });
		if (receiverAccount.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot send a friendship request for the user" } });

		let senderAccount = await Account.findOneAndUpdate({ uniqid: res.locals.user["uniqid"] }, { $push: { friendships: senderFriendship } }, { new: true, setDefaultsOnInsert: true, lean: true });
		if (senderAccount.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot send a friendship request for the user" } });

		return res.status(201).send({ message: { friendship: "Friendship request sended" } });
	
	} catch (err) {
		return next(err);
	}
	
};

exports.patch = async (req, res, next) => {
	try {
		// GET USER
		let receiver = res.locals.params["user"];

		// GET FRIENDSHIP UNIQID
		let friendship = (await Account.findOne({ $and: [{ uniqid: res.locals.user["uniqid"] }, { "friendships.friend": receiver.uniqid }] }, { _id: 0, "friendships.$": 1 }, { lean: true }))[0];
		if (!friendship) return res.status(404).send({ message: { request: "This friendship request does not exists" } });

		// UPDATE REQUEST
		let account = await Account.updateMany({ "friendships.uniqid": friendship.uniqid }, { $set: { "friendships.$.is_accepted": true }, $unset: { "friendships.$.is_sender": "" } }, { runValidators: true, new: true, lean: true });
		if (account.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot accept this friendship request" } });

		return res.status(201).send({ message: { friendship: "Now you are friends" } });

	} catch (err) {
		return next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		// GET USER
		let receiver = res.locals.params["user"];

		// GET FRIENDSHIP UNIQID
		let friendship = (await Account.findOne({ $and: [{ uniqid: receiver.uniqid }, { "friendships.friend": res.locals.user["uniqid"] }] }, { _id: 0, "friendships.$": 1 }, { lean: true }))[0];
		if (!friendship) return res.status(404).send({ message: { request: "This friendship request does not exists" } });

		// UPDATE REQUEST
		let request = await Account.updateMany({ "friendships.uniqid": friendship.uniqid }, { $pull: { friendships: { uniqid: friendship.uniqid } } }, { runValidators: false, lean: true, new: true });
		if (request.nModified === 0) return res.status(422).send({ message: { friendship: "Cannot refuse this friendship request" } });

		return res.status(204).send();

	} catch (err) {
		return next(err);
	}
};