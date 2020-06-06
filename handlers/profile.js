let Account = require("../models/account");

exports.get = async (req, res, next) => {
	try {
		// CHECK IF THE PROFILE EXISTS
		let profile = await Account.findOne({ uniqid: req.params.uniqid }, { _id: 0, uniqid: 1 }, { lean: true });
		if (!profile) return res.status(404).send({ message: { profile: "This profile do not exists" } });

		// BUILD QUERY AND GET THE PROFILE PARSED OBJ
		let query = { uniqid: req.params.uniqid };

		profile = await Account.getProfile(query, req.header("u"));

		return res.status(200).send(profile);
		
	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
};

exports.patch = async (req, res, next) => {
	// SET DICTIONARY TO PARSE/VALIDATE THE RESPONSE BODY
	let selfProfile = Boolean(req.header("u") === req.params.uniqid);

	let dictionary = ["bio", "username", "birthday", "first_name", "last_name", "visibility"];
	let emptyDictionary = ["birthday", "first_name", "last_name", "visibility"];
	let cannotBeEmpty = [];

	let properties = Object.getOwnPropertyNames(req.body.user);
	let allPropertiesMatches = true;

	// CHECK IF PROPERTIES ARE CORRECT AND FILL cannotBeNull ARRAY
	properties.forEach((property) => {
		if(!(dictionary.includes(property))) allPropertiesMatches = false;
		if(emptyDictionary.includes(property)) cannotBeEmpty.push(property);
	});

	// CHECK IF NULL DICTIONARY PROPERTIES ARENT EMPTY
	let isEmpty = cannotBeEmpty.some(property => (req.body.user[property] === "" || req.body.user[property] === undefined || req.body.user[property] === null));

	if (isEmpty) return res.status(403).send({ message: { syntax: "Cannot send empty value for first name, last name, birthday nor visibility" } });
	if (!allPropertiesMatches) return res.status(403).send({ message: { syntax: `Cannot send any value other than ${dictionary.toString()}` } });
	if (!selfProfile) return res.status(422).send({ message: { profile: "Cannot change another user profile" } });

	try {
		
		// SAVE PROFILE
		let profile = await Account.findOneAndUpdate({uniqid: req.header("u")}, req.body.user, {new: true, lean: true});
		if (!profile) return res.status(422).send({ message: { profile: "Cannot save your profile changes" } });

		return res.status(201).send({ message: { profile: "Saved" } });

	} catch (err) {
		console.log(err); return res.status(500).send({ message: { database: "Internal error" } });
	}
};