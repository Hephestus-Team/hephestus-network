const mongoose = require('mongoose'), bcrypt = require('bcrypt'), jwt = require('jsonwebtoken');

let accountSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
        lowercase: true
    },
    gender: {
        type: String,
        enum: ['m', 'f']
    },
    birthday: Date,
    friendship: [mongoose.ObjectId],
    hash: String
});

accountSchema.statics.setHash = function(password) {
    return bcrypt.hashSync(password, 10);
}

accountSchema.statics.verifyHash = function(password, hash) {
    return bcrypt.compareSync(password, hash);
}

accountSchema.statics.verifyJwt = function(jwt) {
    return 
}

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;