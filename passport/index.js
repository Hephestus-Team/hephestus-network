const Account = require("../models/account"), jwt = require("jsonwebtoken"), { mongo: mongoConfig, jwt: jwtConfig } = require("../credentials/cfg");

const LocalStrategy = require("passport-local").Strategy, 
	JwtStrategy = require("passport-jwt").Strategy, 
	ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: jwtConfig.secret
};

exports.signin = new LocalStrategy({ usernameField: "email", passwordField: "hash" }, async (email, password, done) => {

	try{
		// FIND ACCOUNT USING THE EMAIL PROVIDED
		let account = await Account.findOne({ email: email }, { hash: 1, first_name: 1, last_name: 1, uniqid: 1, friendships: 1 }, { lean: true });
		if (!account) return done(null, false, { message: { user: "User not found" } });

		// CHECK IF PASSWORD MATCHES
		let passwordMatches = Account.verifyHash(password, account.hash);
		if (!passwordMatches) return done(null, false, { message: { password: "Incorrect password" } });

		// SET JWT TOKEN
		let id = account._id;
		let token = "Bearer " + jwt.sign({ id }, jwtConfig.secret);

		let user = {
			token: token,
			uniqid: account.uniqid,
			first_name: account.first_name,
			last_name: account.last_name,
			friendships: account.friendships,
			name: account.first_name + " " + account.last_name
		};

		return done(null, account, user);

	}catch(err){
		return done(err, false, null);
	}
});

exports.jwt = new JwtStrategy(opts, (jwt_payload, done) => {
	Account.findOne({ _id: jwt_payload.id }, (err, account) => {
		if(err) { return done(err); }
		if (!account) { return done(null, false, { message: "Not logged in" }); }
		return done(null, jwt_payload.id, { message: { user: "Logged in" } });
	});
});
