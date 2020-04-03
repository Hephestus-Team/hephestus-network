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
            // debugg
            console.log(account);
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
    if (/^[a-zA-Z0-9]\w+$/.test(req.body.receiver)) {
        if(req.body.receiver === req.body.sender){
            res.status(422).send({ message: { user: 'Cannot send yourself a friendship request' } });
        }

        Account.getFriendship(Account, {sender: req.body.sender, receiver: req.body.receiver}, (friendship) => {
            if (err) { return res.status(500).send({ message: { database: 'Internal error' } }); }
            if(friendship){ return res.status(422).send({ message: { user: 'A friendship request already exists' } }); }
        });

        Account.find({uniqid: {$in: [req.body.sender, req.body.receiver]}}, (err, accounts) => {
            if (err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' } }); }
    
            friendship_uniqid = Account.setFriendship(accounts[0], accounts[1]);
    
            accounts[0].friendship = friendship_uniqid.sender;
            accounts[1].friendship = friendship_uniqid.receiver;
    
            accounts.forEach((account, index, accounts) => {
                Account.findOneAndUpdate({uniqid: account.uniqid}, {$push: {friendship: account.friendship}}, (err, account) => {
                    if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                    if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
                });
            });
    
            return res.status(201).send({ message: { friendship: 'You sended a friendship request' } });
        });
    } else {
        res.status(422).send({ message: { uniqid: 'Cannot process user id' } });
    }
}

exports.accept = (req, res, next) => {

    let is_sender = Account.findOne({uniqid: req.body.receiver, "friendship.friend": req.body.sender, "friendship.is_sender": true}, (err, account) => {
        if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
        if(!account) { return false }
        return true;
    });

    if(!is_sender){
        Account.findOne({uniqid: req.body.receiver, "friendship.friend": req.body.sender}, (err, account) => {
            if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Request does not exist'}}); }
            console.log(account.friendship[0]);

            Account.updateMany({"friendship._id": {$eq: account.friendship[0]._id}}, {$set: {"friendship.0.accepted": true}, $unset: {sender: ""}}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(409).send({message: {user: 'Friendship request does not exist'}}); }
                return res.status(201).send({message: {friendship: 'Now you are friends'}});
            });

        });
    }else{
        res.status(409).send({message: {user: 'Cannot accept your own request'}});
    }
}

exports.refuse = (req, res, next) => {
    if(/^[a-zA-Z0-9]\w+$/.test(req.body.receiver)){
        Account.findOne({uniqid: req.body.receiver, "friendship.friend": req.body.sender, "friendship.is_accepted": false}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Friendship does not exist'}}); }

            Account.updateMany({"friendship._id": {$eq: account.friendship[0]._id}}, {$pull: {"friendship.friend": {$in: [req.body.sender, req.body.receiver]}}}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(409).send({message: {user: 'Friendship request does not exist'}}); }
                return res.status(201).send({message: {friendship: 'You do not accepted the request'}});
            });

        });
    }else{
        res.status(422).send({message: {uniqid: 'Cannot process user id'}});
    }
}

exports.profile = (req, res, next) => {
    if(req.header('u') === req.params.uniqid || req.params.uniqid === undefined){
        Account.findOne({uniqid: {$in: [req.params.uniqid, req.header("u")]}}, { hash: 0, created_at: 0, email: 0, __v: 0, _id: 0 }, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
            account.is_user = false;
            Account.getFriend(Account, account.friendship, (friends) => {
                account.friends = friends;
                delete account.friendship;
                return res.status(200).send(account);
            });
        });
    }else{
        Account.findOne({uniqid: req.params.uniqid}, { hash: 0, created_at: 0, email: 0, __v: 0, _id: 0 }, {lean: true}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
            account.is_user = false;
            Account.getFriend(Account, account.friendship, (friends) => {
                account.friends = friends;
                delete account.friendship;
                return res.status(200).send(account);
            });            
        });
    }
}

exports.publish = (req, res, next) => {
    let post = {
        uniqid: Account.setUniqid('post'),
        content: req.body.content,
    }

    Account.findOneAndUpdate({uniqid: req.body.sender}, {$push: {post: post}}, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

        //TODO
        /* Need to change this logic, pls!! */
        return res.status(201).send({message: {post: account.post[account.post.length - 1]}});
    });
}

exports.comment = (req, res, next) => {
    let comment = {
        uniqid: Account.setUniqid('post'),
        content: req.body.content,
        user: req.body.sender
    }

    Account.findOneAndUpdate({uniqid: req.body.poster, "post.uniqid": req.body.post}, {$push: {"post.0.comment": comment}}, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(!account) { return res.status(403).send({message: {user: 'This post does not exists'}}); }

        //TODO
        /* Need to change this logic, pls!! */
        return res.status(201).send({message: {comment: account.post[0].comment[account.post[0].comment.length - 1]}});
    });
}

exports.like = (req, res, next) => {
    let like = {
        user: req.body.sender
    }

    if(req.params.type === 'comment'){
        Account.findOneAndUpdate({uniqid: req.body.poster, "post.uniqid": req.body.post, "post.comment.uniqid": req.body.comment}, {$push: {"post.$.comment.0.like": like}} ,(err, account) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
    
            return res.status(201).send({message: {like: 'Liked!'}});
        });
    }else if(req.params.type === 'post'){
        Account.findOneAndUpdate({uniqid: req.body.poster, "post.uniqid": req.body.post}, {$push: {"post.$.like": like}}, (err, account) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
    
            return res.status(201).send({message: {like: 'Liked!'}});
        });
    }else{
        res.status(422).send({message: {type: 'Cannot process query type'}});
    }

}