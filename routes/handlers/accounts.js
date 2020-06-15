let Account = require("../../models/account");

exports.get = async (req, res, next) => {
	try {

		// GET THE PARSED PROFILE OBJ
		let profile = await Account.getProfile(req.params.user, req.header("u"), 6);

		return res.status(200).send(profile);
		
	} catch (err) {
		return next(err);
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
		let profile = await Account.findOneAndUpdate({ uniqid: req.header("u") }, req.body.user, { runValidators: true, new: true, lean: true });
		if (!profile) return res.status(422).send({ message: { profile: "Cannot save your profile changes" } });

		return res.status(201).send({ message: { profile: "Saved" } });

	} catch (err) {
		next(err);
	}
};