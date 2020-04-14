let Account = require('../models/account'), passport = require('passport'), strategy = require('../strategies');

passport.use(strategy.signin);
passport.use(strategy.jwt);

exports.jwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, account, info) => {

        if(err) { return res.status(500).send(err); }
        if(!account) { return res.status(401).send(info); }

        return next();
    })(req, res, next);
}

exports.signup = (req, res, next) => {
    Account.findOne({email: req.body.email}, (err, account) =>{

        if(err) { return console.log(err); }
        if(account) { return res.status(409).send({message: {email: 'User already exists'}}); }

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

exports.add = (req, res, next) => {
    if(req.body.sender === req.body.receiver) res.status(409).send({message: {request: "You cannot send yourself a friendship request"}});

    let id = Account.setUniqid('user');

    let senderFriendship = {
        _id: id,
        is_sender: true,
        friend: req.body.receiver
    },
    receiverFriendship = {
        _id: id,
        is_sender: false,
        friend: req.body.sender
    };

    Account.find({uniqid: {$in: [req.body.receiver, req.body.sender]}, "friendships.friend": {$in: [req.body.receiver, req.body.sender]}}, (err, accounts) => {
        
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(accounts.length !== 0) { return res.status(403).send({message: {user: 'Already sended a friendship request to this user'}}); }
        
        Account.findOneAndUpdate({uniqid: req.body.receiver}, {$push: {friendships: receiverFriendship}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
            
            Account.findOneAndUpdate({uniqid: req.body.sender}, {$push: {friendships: senderFriendship}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
               
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
    
                return res.status(201).send({message: {friendship: "You sended a friendship request"}});
            });
        });
    });
}

exports.publish = (req, res, next) => {
    let post = {
        uniqid: Account.setUniqid('post'),
        content: req.body.content,
        name: req.body.name
    }

    Account.findOneAndUpdate({uniqid: req.body.uniqid}, {$push: {posts: post}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
        
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

        Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post}, {$push: {"posts.0.comments": comment}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'This post does not exists'}}); }
    
            return res.status(201).send(account.posts[0].comments[account.posts[0].comments.length - 1]);
        });

    }else if(req.params.type === undefined){
        let comment = {
            uniqid: Account.setUniqid('post'),
            content: req.body.sender.content,
            user: req.body.sender.uniqid,
            name: req.body.sender.name
        }

        Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post}, {$push: {"posts.0.comments": comment}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
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
        Account.getCommentIndex(Account, {uniqid: req.body.poster, post: req.body.post, comment: req.body.comment}, (err, element) => {
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!element) { return res.status(403).send({ message: { comment: 'This comment does not exists' }}); }

            Account.findOneAndUpdate({uniqid: req.body.poster, "posts.uniqid": req.body.post}, {$push: {[element]: like}}, {new: true}, (err, account) => {
                if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }
        
                let postIndex = Account.getIndexByUniqid(account.posts, req.body.post),
                commentIndex = Account.getIndexByUniqid(account.posts[postIndex].comments, req.body.comment);
                likeIndex = account.posts[postIndex].comments[commentIndex].likes.length - 1;

                delete account._id;

                return res.status(201).send(account.posts[postIndex].comments[commentIndex].likes[likeIndex]);
            });
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
    let shareMetadata = {
        user: req.body.poster.uniqid,
        name: req.body.poster.name,
        post: req.body.poster.post
    },
    post = {
        uniqid: Account.setUniqid('post'),
        name: req.body.sender.name,
        is_share: true,
        content: req.body.sender.content,
        shareMetadata: shareMetadata,
    },
    share = {
        user: req.body.sender.uniqid,
        name: req.body.sender.name,
        post: post.uniqid
    };

    Account.findOneAndUpdate({uniqid: req.body.poster.uniqid, "posts.uniqid": req.body.poster.post}, {$push: {"posts.$.shares": share}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
        if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }
        
        let index = Account.getIndexByUniqid(account.posts, req.body.poster.post),
        original = account.posts[index];

        Account.findOneAndUpdate({uniqid: req.body.sender.uniqid}, {$push: {"posts": post}}, {new: true, setDefaultsOnInsert: true}, (err, account) => {
            
            if(err) { console.log(err.errmsg); return res.status(500).send({ message: { database: 'Internal error' }}); }

            let index = account.posts.length - 1;
            
            return res.status(201).send({share: account.posts[index], original: original});
        });
    });
}