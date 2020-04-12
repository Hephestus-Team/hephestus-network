const mongoose = require('mongoose'), bcrypt = require('bcrypt'), 
uniqid = require('uniqid'), subdocument = require('./subdocument');

let accountSchema = mongoose.Schema({
    uniqid: String,
    first_name: String,
    last_name: String,
    username: String,
    bio: String,
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
        if(err) { cb(err, null); }
        if(!accounts) { return cb(null, null); }
        accounts.forEach((account, index, accounts) => {
            friends.push({
                uniqid: account.uniqid,
                name: `${account.first_name} ${account.last_name}`
            });
        });
        cb(null, friends);
    });
}

accountSchema.statics.getIndexByUniqid = function getIndexByUniqid(array, value) {
    return array.findIndex((element) => {
        return element.uniqid === value;
    });
}

accountSchema.statics.getCommentIndex = function getComment(Account, poster, cb) {
    Account.findOne({uniqid: poster.uniqid}, {"posts": {$elemMatch: {uniqid: poster.post}}, _id: 0}, { lean: true }, (err, account) => {
        if(err) { cb(err, null); }
        if(!account) { cb(null, null); }

        let posts = account.posts,
        index = Account.getIndexByUniqid(posts[0].comments, poster.comment),
        element = `posts.$.comments.${index}.likes`;

        cb(null, element);
    });
}

accountSchema.statics.getProfile = function getProfile(Account, operator, metadata, cb) {
    Account.findOne(operator, { hash: 0, created_at: 0, __v: 0, _id: 0, email: 0 }, { lean: true }, (err, account) => {
        if(err) { cb(err, null); }
        if (metadata) { account = {...account, metadata}; }

        if (account.friendships.length === 0) {
            cb(null, account);
        } else {
            Account.getFriend(Account, account.friendships, (err, friends) => {
                if(err) { cb(err, null); }
                delete account.friendships;
                account.friendships = friends;                

                cb(null, account);
            });
        }
    });
}

let Account = mongoose.model('Account', accountSchema);

module.exports = Account;