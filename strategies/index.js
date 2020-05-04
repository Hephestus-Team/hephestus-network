const Account = require("../models/account"), jwt = require("jsonwebtoken");

const LocalStrategy = require("passport-local").Strategy, 
	JwtStrategy = require("passport-jwt").Strategy, 
	ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: require("../credentials/cfg").jwt.jwtSecret,
};

exports.signin = new LocalStrategy({usernameField: "email", passwordField: "hash"}, (email, password, done) => {
	Account.findOne({email: email}, (err, account) => {
		if(err) { return done(err); }
		if(!account) { return done(null, false, {message: {user: "User not found"}}); }
		if(!Account.verifyHash(password, account.hash)) { return done(null, false, {message: {hash: "Incorrect password"}}); }
		let id = account._id;

		let token = "Bearer " + jwt.sign({id}, require("../credentials/cfg").jwt.jwtSecret);

		let user = {
			token: token,
			uniqid: account.uniqid,
			first_name: account.first_name,
			last_name: account.last_name,
			friendships: account.friendships,
			name: account.first_name + " " + account.last_name
		};
		return done(null, account, user);
	});
});

exports.jwt = new JwtStrategy(opts, (jwt_payload, done) => {
	Account.findOne({_id: jwt_payload.id}, (err, account) => {
		if(err) { return done(err); }
		if(!account) { return done(null, false, {message: "Not logged in"}); }
		return done(null, account, {message: {user: "Logged in"}});
	});
});
