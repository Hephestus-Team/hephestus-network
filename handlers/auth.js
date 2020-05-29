let Account = require("../models/account"), passport = require("passport");

exports.signup = (req, res, next) => {
	Account.findOne({email: req.body.email}, (err, account) =>{
        
		if(err) { return console.log(err); }
		if(account) { return res.status(409).send({message: {email: "User already exists"}}); }
        
		new Account({
			uniqid: Account.setUniqid("user"),
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			gender: req.body.gender,
			birthday: new Date(req.body.birthday),
			hash: Account.setHash(req.body.hash)
		}).save(null, (err, account) => {
			if(err){ return console.log(err); }
		});
        
		return res.status(201).send({message: {user: "You are now part of the community"}});
	});
};

exports.signin = (req, res, next) => {
	passport.authenticate("local", { session: false }, (err, account, info) => {
        
		if(err) { console.log(err); return res.status(500).send({ message: { database: "Internal error" } }); }
		if(!account) { return res.status(401).send(info); }
        
		return res.status(201).send(info);
	})(req,res,next);
};