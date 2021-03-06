const Account = require('../models/account'), jwt = require('jsonwebtoken'), jwtSecret = require('../jwt/config').jwtSecret;

const LocalStrategy = require('passport-local').Strategy, 
        JwtStrategy = require('passport-jwt').Strategy, 
        ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}

exports.signin = new LocalStrategy({usernameField: 'email', passwordField: 'hash'}, (email, password, done) => {
    Account.findOne({email: email}, (err, account) => {
        if(err) { return done(err); }
        if(!account) { return done(null, false, {message: 'UserNotFound'}); }
        if(!Account.verifyHash(password, account.hash)) { return done(null, false, {message: {hash: 'Incorrect password'}}); }
        let id = account._id;
        return done(null, account, {token: 'Bearer ' + jwt.sign({id}, jwtSecret, {expiresIn: "2 days"})});
    });
});

exports.jwt = new JwtStrategy(opts, (jwt_payload, done) => {
    Account.findOne({_id: jwt_payload.id}, (err, account) => {
        if(err) { return done(err); }
        if(!account) { return done(null, false, {message: 'Not logged in'}); }
        return done(null, account, {message: 'LoggedIn'});
    });
});
