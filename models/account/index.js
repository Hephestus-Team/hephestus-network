const mongoose = require('mongoose'), bcrypt = require('bcrypt'), 
uniqid = require('uniqid'), subdocument = require('./subdocument');

let accountSchema = mongoose.Schema({
    uniqid: String,
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
    friendships: [subdocument.Friendship],
    hash: String,
    posts: [subdocument.Post],
    created_at: { type: Date, default: Date.now }
});

accountSchema.statics.setHash = function setHash(password) {
    return bcrypt.hashSync(password, 10);
}

accountSchema.statics.verifyHash = function verifyHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}

accountSchema.statics.setUniqid = function setUniqid(type) {
    if(type === 'user'){
        return uniqid();
    }else if(type === 'post'){
        return uniqid.time();
    }else{
        throw new Error('Cannot proccess type');
    }
}

accountSchema.statics.getFriend = function getFriend(Account, friendships, cb) {

    let friends_uniqid = [];
    var friends = [];

    friendships.forEach((friendship, index, friendships) => {
        friends_uniqid.push(friendship.friend);
    });

    Account.find({uniqid: {$in: friends_uniqid}}, {hash: 0, created_at: 0, email: 0, __v: 0, _id: 0, birthday: 0, friendships: 0, gender: 0}, {lean: true}, (err, accounts) => {
        if(err) { return console.log(err); }
        if(!accounts) { return false; }
        accounts.forEach((account, index, accounts) => {
            friends.push({
                uniqid: account.uniqid,
                name: `${account.first_name} ${account.last_name}`
            });
        });
        cb(friends);
    });
}

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;