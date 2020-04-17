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

accountSchema.statics.getProfilePost = function getPostProfilePost(Account, uniqid, user, cb){
    Account.findOne({uniqid: uniqid}, {_id: 0}, (err, account) => {
        if(err) { cb(err, null); }
        if(!account) { cb(null, null); }
        
        let posts = account.posts.map(post => post.uniqid);
    
        //get share posts
        Account.aggregate([{$unwind: "$posts" }, {$match: {uniqid: account.uniqid, "posts.uniqid": {$in: posts}}}, 
        {
            $project: {
                "posts.uniqid": 1,
                "posts.content": 1,
                "posts.original": {
                    $cond: {if: {$eq: ["$posts.is_share", true]}, then: "$posts.shareMetadata.post", else: false}
                },
                "posts.created_at": 1,
                "posts.visibility": 1,
                "posts.is_share": 1,
                "posts.name": 1,
                "posts.shares": 1,
                "posts.likes": 1,
                "posts.comments": 1,
                "posts.created_at": 1,
                "posts.is_liked": {
                    $cond: {if: {$eq: ["$posts.likes.user", user]}, then: true, else: false}
                },
                _id: 0
            }
        }, {$sort: { "posts.original": 1 } }], (err, accounts) => {
            if(err) { cb(err, null); }
            if(!accounts) { cb(null, null); }
    
            let posts = accounts.map(account => account.posts);
            let shares = posts.filter(post => post.is_share);
            
            posts = posts.filter(post => !post.is_share);

            // get original posts
            Account.aggregate([{$unwind: "$posts" }, {$match: {"posts.uniqid": {$in: shares.map(share => share.original)}}}, 
            {
                $project: {
                    "posts.uniqid": 1,
                    "posts.content": 1,
                    "posts.name": 1,
                    _id: 0
                }
            }, {$sort: { "posts.uniqid": 1 } }], (err, originals) => {
                if(err) { cb(err, null) }
                if(!originals) { cb(null, null) }
        
                originals = originals.map(original => original.posts);
    
                shares.forEach(share => {
                    let original = originals.find(original => original.uniqid == share.original);
                    delete share.original;

                    share.original = (original !== undefined) ? original : false;
                });
    
                posts = posts.concat(shares);
    
                cb(null, posts);
            });
        });
    });
}

accountSchema.statics.getProfile = function getProfile(Account, operator, user, cb) {
    Account.findOne(operator, { hash: 0, created_at: 0, __v: 0, _id: 0, email: 0 }, { lean: true }, (err, account) => {
        if(err) { cb(err, null); }

        if (account.friendships.length === 0) {
            Account.getProfilePost(Account, account.uniqid, user, (err, posts) => {
                if(err) { cb(err, null); }
                delete account.posts
                account.posts = posts;
                
                cb(null, account);
            });
        } else {
            Account.getFriend(Account, account.friendships, (err, friends) => {
                if(err) { cb(err, null); }
                delete account.friendships;
                account.friendships = friends;                

                Account.getProfilePost(Account, account.uniqid, user, (err, posts) => {
                    if(err) { cb(err, null); }
                    delete account.posts
                    account.posts = posts;
                    
                    cb(null, account);
                });
            });
        }
    });
}

let Account = mongoose.model('Account', accountSchema);

module.exports = Account;