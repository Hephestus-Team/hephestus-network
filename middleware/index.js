const passport = require("passport"), strategy = require("../strategies"), Account = require("../models/account");

passport.use(strategy.signin);
passport.use(strategy.jwt);

module.exports = {
	uniqid: (req, res, next) => {
		let _id = Account.getJwtPayload(req.header("Authorization"));
		Account.findOne({$and: [{_id: _id}, {uniqid: req.header("u")}]}, (err, account) => {
			if(err) { return res.status(500).send({message: {database: "Internal error"}}); }
			if(!account) { return res.status(401).send({message: {user: "Cannot perform this action"}}); }

			return next();
		});
	},    
	jwt: (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, account, info) => {
			if(err) { return res.status(500).send(err); }
			if(!account) { return res.status(401).send(info); }
            
			return next();
		})(req, res, next);
	}
};