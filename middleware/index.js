const passport = require("passport"), strategy = require("../strategies"), Account = require("../models/account");

passport.use(strategy.signin);
passport.use(strategy.jwt);

module.exports = {
	uniqid: async function(req, res, next){

		try {
			// GET THE MONGODB USER ID BY THE JWT
			let _id = Account.getJwtPayload(req.header("Authorization"));

			// CHECK IF THE ID MATCHES WITH THE USER UNIQID
			let account = await Account.findOne({ $and: [{ _id: _id }, { uniqid: req.header("u") }] }, { lean: true });
			if (!account) return res.status(401).send({ message: { user: "Cannot perform this action" } });

			return next();
			
		} catch (err) {
			console.log(err); return res.status(500).send({ message: { server: "Internal error" } });
		}

	},    
	jwt: (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, account, info) => {
			if(err) { return res.status(500).send(err); }
			if(!account) { return res.status(401).send(info); }
            
			return next();
		})(req, res, next);
	}
};