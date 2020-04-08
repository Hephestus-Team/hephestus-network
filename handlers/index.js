let Account = require('../models/account'), passport = require('passport'), strategy = require('../strategies');

passport.use(strategy.signin);
passport.use(strategy.jwt);

exports.signup = (req, res, next) => {
    Account.findOne({email: req.body.email}, (err, account) =>{
        if(err) { return console.log(err); }
        if(account) { return res.status(409).send({message: {email: 'User already exists'}}); }
        console.log(req.body);
        new Account({
            uniqid: Account.setUniqid('user'),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            birthday: new Date(req.body.birthday),
            hash: Account.setHash(req.body.hash)
        }).save(null, (err, account) => {
            if(err){ return console.log(err); }
        });

        return res.status(201).send({message: {user: 'You are now part of the community'}});
    });
}

exports.local = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, account, info) => {
        if(err) { return res.status(500).send(err); }
        if(!account) { return res.status(401).send(info); }
        return res.status(201).send(info);
    })(req,res,next);
}

exports.jwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, account, info) => {
        if(err) { return res.status(500).send(err); }
        if(!account) { return res.status(401).send(info); }
        return next();
    })(req, res, next);
}

exports.add = (req, res, next) => {
    if(req.body.sender === req.body.receiver){
        res.status(409).send({message: {request: "You cannot send yourself a friendship request"}});
    }

    let id = Account.setUniqid('user');

    let senderFriendship = {
        _id: id,
        is_accepted: false,
        is_sender: true,
        friend: req.body.receiver
    },
    receiverFriendship = {
        _id: id,
        is_accepted: false,
        is_sender: false,
        friend: req.body.sender
    };

    Account.find({uniqid: {$in: [req.body.receiver, req.body.sender]}, "friendships.friend": {$in: [req.body.receiver, req.body.sender]}}, (err, accounts) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(accounts.length !== 0) { return res.status(403).send({message: {user: 'Already sended a friendship request to this user'}}); }
        
        Account.findOneAndUpdate({uniqid: req.body.receiver}, {$push: {friendships: receiverFriendship}}, {new: true}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
            
            Account.findOneAndUpdate({uniqid: req.body.sender}, {$push: {friendships: senderFriendship}}, {new: true}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
    
                return res.status(201).send({message: {friendship: "You sended a friendship request"}});
            });
        });
    });
}

exports.accept = (req, res, next) => {
    Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender, "friendships.is_sender": true}, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(account) { return res.status(409).send({message: {user: 'Cannot accept your own request'}});  }

        Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender}, (err, account) => {
            if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Request does not exist'}}); }

            Account.updateMany({uniqid: [req.body.receiver, req.body.sender], "friendships._id": account.friendships[0]._id}, {$set: {"friendships.0.is_accepted": true}, $unset: {"friendships.0.is_sender": ""}}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(409).send({message: {user: 'Friendship request does not exist'}}); }

                return res.status(201).send({message: {friendship: 'Now you are friends'}});
            });

        });
    });
}

exports.refuse = (req, res, next) => {
    Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender, "friendships.is_sender": true}, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(account) { return res.status(409).send({message: {user: 'Cannot refuse your own request'}});  }

        Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender}, (err, account) => {
            if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Friendship request does not exist'}}); }

            Account.updateMany({uniqid: [req.body.receiver, req.body.sender], "friendships._id": account.friendships[0]._id}, { $pull: { "friendships": { "_id": account.friendships[0]._id} } }, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(409).send({message: {user: 'Friendship request does not exist'}}); }

                return res.status(201).send({message: {friendship: 'You do not accepted the request'}});
            });

        });
    });
}

exports.profile = (req, res, next) => {
    if(req.header('u') === req.params.uniqid || req.params.uniqid === undefined){
        Account.findOne({uniqid: {$in: [req.params.uniqid, req.header("u")]}}, { hash: 0, created_at: 0, __v: 0, _id: 0 }, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

            account.is_user = true;

            if(account.friendships === null){
                return res.status(200).send(account);
            }else{
                Account.getFriend(Account, account.friendships, (friends) => {
                    account.friends = friends;
                    delete account.friendships;
    
                    return res.status(200).send(account);
                });
            }
        });
    }else{
        Account.findOne({uniqid: req.params.uniqid}, { hash: 0, created_at: 0, __v: 0, _id: 0 }, {lean: true}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

            account.is_user = false;

            if(account.friendships === null){
                return res.status(200).send(account);
            }else{
                Account.getFriend(Account, account.friendships, (friends) => {
                    account.friends = friends;
                    delete account.friendships;
    
                    return res.status(200).send(account);
                });
            }           
        });
    }
}

exports.publish = (req, res, next) => {
    let post = {
        uniqid: Account.setUniqid('post'),
        content: req.body.content,
        name: req.body.name
    }

    Account.findOneAndUpdate({uniqid: req.body.uniqid}, {$push: {posts: post}}, {new: true}, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

        let index = account.posts.length - 1;
        return res.status(201).send(account.posts[index]);
    });
}

exports.comment = (req, res, next) => {

    if(req.params.type === 'reply'){

        let replyMetadata = {
            user: req.body.commentator.uniqid,
            name: req.body.commentator.name,
            comment: req.body.commentator.comment
        }

        let comment = {
            uniqid: Account.setUniqid('post'),
            content: req.body.sender.content,
            user: req.body.sender.uniqid,
            name: req.body.sender.name,
            replyMetadata: replyMetadata,
            is_reply: true
        }

        Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post}, {$push: {"posts.0.comments": comment}}, {new: true}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'This post does not exists'}}); }
    
            return res.status(201).send(account.posts[0].comments[account.posts[0].comments.length - 1]);
        });

    }else if(req.params.type === undefined){
        let comment = {
            uniqid: Account.setUniqid('post'),
            content: req.body.content,
            user: req.body.sender,
            name: req.body.name
        }
    
        Account.findOneAndUpdate({uniqid: req.body.poster, "posts.uniqid": req.body.post}, {$push: {"posts.0.comments": comment}}, {new: true}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'This post does not exists'}}); }
    
            return res.status(201).send(account.posts[0].comments[account.posts[0].comments.length - 1]);
        });
    }
}

exports.like = (req, res, next) => {
    let like = {
        user: req.body.sender,
        name: req.body.name
    }

    if(req.params.type === 'comment'){
        Account.findOneAndUpdate({uniqid: req.body.poster, "posts.uniqid": req.body.post, "posts.comments.uniqid": req.body.comment}, {$push: {"posts.$.comments.0.likes": like}}, {new: true}, (err, account) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

            let index = account.posts[0].comments[0].likes.length - 1;
            delete account.posts[0].comments[0].likes[index]._id;
            return res.status(201).send(account.posts[0].comments[0].likes[index]);
        });
    }else if(req.params.type === 'post'){
        Account.findOneAndUpdate({uniqid: req.body.poster, "posts.uniqid": req.body.post}, {$push: {"posts.$.likes": like}}, {new: true}, (err, account) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

            let index = account.posts[0].likes.length - 1;
            delete account.posts[0].likes[index]._id;
            return res.status(201).send(account.posts[0].likes[index]);
        });
    }else{
        res.status(422).send({message: {type: 'Cannot process query type'}});
    }

}

exports.share = (req, res, next) => {
    /* 
    sender uniqid, poster uniqid, post uniqid, 
    */

    //share metadata => post son
    let shareMetadata = {
        user: req.body.poster.uniqid,
        name: req.body.poster.name,
        post: req.body.poster.post
    };

    let share = {
        user: req.body.sender.uniqid,
        name: req.body.sender.name,
    }
    //share => original post
    let post = {
        uniqid: Account.setUniqid('post'),
        name: req.body.sender.name,
        is_share: true,
        content: req.body.sender.content,
        shareMetadata: shareMetadata,
    }

    Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "post.uniqid": req.body.poster.post}, {$push: {"post.0.shares": share}}, (err, account) => {
        if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
        Account.findOneAndUpdate({uniqid: req.body.sender.uniqid}, {$push: {"posts": post}}, {new: true}, (err, account) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }

            let index = account.posts.length - 1;
            return res.status(201).send(account.posts[index]);
        });
    });
}