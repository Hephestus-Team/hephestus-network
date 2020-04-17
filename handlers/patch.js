let Account = require('../models/account');

exports.add = (req, res, next) => {
    Account.aggregate([{$unwind: "$friendships"}, {$match: {uniqid: req.body.sender, "friendships.friend": req.body.receiver, "friendships.is_sender": true}}], (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(account.length !== 0) { return res.status(409).send({message: {user: 'Cannot accept your own request'}});  }

        Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender}, (err, account) => {            
            if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Request does not exist'}}); }

            Account.updateMany({uniqid: [req.body.receiver, req.body.sender], "friendships._id": account.friendships[0]._id}, {$set: {"friendships.0.is_accepted": true}, $unset: {"friendships.0.is_sender": ""}}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(403).send({message: {user: 'Friendship request does not exist'}}); }

                return res.status(201).send({message: {friendship: 'Now you are friends'}});
            });
        });
    });
}

exports.profile = (req, res, next) => {
    if(req.header('u') === req.params.uniqid || (req.params.uniqid === undefined && req.header('u')) ){
        Account.findOneAndUpdate({uniqid: req.header('u')}, req.body.user, {new: true}, (err, account) => {
            
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            delete account._id, account.hash, account.email;

            return res.status(200).send(account);
        });
    }else{
        return res.status(401).send({message: {user: "You cannot change another user information"}});
    }
}

exports.publish = (req, res, next) => {
    Account.aggregate([{$unwind: "$posts"}, {$match: {uniqid: req.body.uniqid.poster, "posts.uniqid": req.body.uniqid.post}}, {
        $project : { _id: 0, posts: 1}
    }], (err, account) => {
        if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(!account) { return res.status(403).send({message: {post: "This post does not exists"}}); }

        let posts = account.map(account => {return {content: account.posts.content, created_at: new Date()}});
        let old_content = posts[0];

        Account.findOneAndUpdate({uniqid: req.body.uniqid.poster, "posts.uniqid": req.body.uniqid.post}, {$set: {"posts.$.content": req.body.change.content}, $push: {"posts.$.changes": old_content}}, {new: true}, (err, account) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {post: "This post does not exists"}}); }
    
            return res.status(200).send({message: {post: "Post edited"}});
        });
    });
}