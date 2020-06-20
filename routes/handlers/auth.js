let Account = require("../../models/account"), passport = require("passport");

exports.signup = async (req, res, next) => {
	// TRY-CATCH BLOCK TO CATCH ANY MONGO DRIVER EXCEPTION
	try {

		let account = await Account.findOne({ email: req.body.email }, { lean: true });
		if (account) return res.status(409).send({ message: { email: "User already exists" } });

	} catch (err) {
		return next(err);
	}

	// TRY-CATCH BLOCK TO CATCH ANY MONGOOSE EXCEPTION
	try {

		let newUser = new Account({
			uniqid: Account.setUniqid("user"),
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			gender: req.body.gender,
			birthday: new Date(req.body.birthday),
			hash: Account.setHash(req.body.hash)
		});

		await newUser.save();

		return res.status(201).send({ message: { user: "You are now part of the community" } });

	} catch (err) {

		let errorsName = Object.getOwnPropertyNames(err.errors);
		let errors = [];

		errorsName.forEach(error => {
			errors.push({
				path: err.errors[error].path,
				message: err.errors[error].message
			});
		});

		next(errors);
	}
};

exports.login = (req, res, next) => {
	passport.authenticate("local", { session: false }, async (err, account, info) => {
        
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if(!account) { return res.status(401).send(info); }
        
		return res.status(201).send(info);
	})(req,res,next);
};