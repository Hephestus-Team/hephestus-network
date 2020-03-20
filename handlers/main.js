var Account = require('../models/account'), passport = require('passport'), strategy = require('../strategies/main');

passport.use(strategy.signin);
passport.use(strategy.jwt);

exports.signup = (req, res, next) => {
    Account.findOne({email: req.body.email}, (err, account) =>{
        if(err) { return console.log(err); }
        if(account) { return res.status(303).send({message: {email: 'User already exists'}}); }

        new Account({
            uniqid: Account.setUniqid(req.body.first_name),
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

        return res.status(200).send({message: {user: 'You are now part of the community'}});
    });
}

exports.local = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, account, info) => {
        if(err) { return res.status(500).send(err); }
        if(!account) { return res.status(303).send(info); }
        return res.status(200).send(info);
    })(req,res,next);
}

exports.jwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, account, info) => {
        if(err) { return res.status(500).send(err); }
        if(!account) { return res.status(401).send(info); }

        if(req.path == '/signin'){
            return res.status(200).send(info);
        }else{
            return next();
        }

    })(req, res, next);
}

//Check TODO in /routes
exports.add = (req, res, next) => { 
    if(/^[a-zA-Z0-9]+[\.]\w+$/.test(req.query.u)){

        Account.findOne({uniqid: {$in: [req.header('uniqid'), req.query.u]}, "friendship.friend": {$in: [req.header('uniqid'), req.query.u]}}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(account){ return res.status(422).send({message: {user: 'A friendship request already exists'}}); }

            Account.findOne({uniqid: req.query.u}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account){ return res.status(303).send({message: {user: 'User do not exist'}}); }
    
                Account.find({uniqid: {$in: [req.header('uniqid'), req.query.u]}}, (err, accounts) => {
                    if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        
                    friendship_uniqid = Account.setFriendshipUniqid(accounts[0], accounts[1]);
        
                    accounts[0].friendship = friendship_uniqid.sender;
                    accounts[1].friendship = friendship_uniqid.receiver;
        
                    accounts.forEach((account, index, accounts) => {
                        account.save((err, account) => {
                            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                            //debugg
                            return console.log(`New friendship ${account.friendship} !`);
                        });
                    });
                    
                    return res.status(200).send({message: {friendship: 'You sended a friendship request'}});
                });
            });
        });
    }else{
        res.status(422).send({message: {uniqid: 'Cannot process user id'}});
    }
}

exports.accept = (req, res, next) => {
    if(/^[a-zA-Z0-9]+[\.]\w+$/.test(req.query.u)){
        Account.findOne({uniqid: req.query.u, "friendship.friend": req.get('uniqid')}, (err, account) => {
            if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Friendship does not exist'}}); }
            console.log(account.friendship[0]);

            Account.updateMany({"friendship._id": {$eq: account.friendship[0]._id}}, {$set: {"friendship.0.accepted": true}}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(303).send({message: {user: 'Friendship request does not exist'}}); }
                return res.status(200).send({message: {friendship: 'Now you are friends'}});
            });

        });
    }else{
        res.status(422).send({message: {uniqid: 'Cannot process user id'}});
    }
}

exports.refuse = (req, res, next) => {
    if(/^[a-zA-Z0-9]+[\.]\w+$/.test(req.query.u)){
        Account.findOne({uniqid: req.query.u, "friendship.friend": req.get('uniqid')}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Friendship does not exist'}}); }

            Account.updateMany({"friendship._id": {$eq: account.friendship[0]._id}}, {$pull: {"friendship.friend": {$in: [req.header('uniqid'), req.query.u]}}}, (err, account) => {
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(303).send({message: {user: 'Friendship request does not exist'}}); }
                return res.status(200).send({message: {friendship: 'You do not accepted the request'}});
            });

        });
    }else{
        res.status(422).send({message: {uniqid: 'Cannot process user id'}});
    }
}

//TODO
/* If send user data through signin this handler will be obsolete */
exports.feed = (req, res, next) => {
    Account.findOne({uniqid: req.header('uniqid')}, { hash: 0, birthday: 0, created_at: 0, gender: 0, email: 0, __v: 0, _id: 0, uniqid: 0 }, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(!account) { return res.status(403).send({message: {user: 'User does not exist'}}); }

        res.status(200).send(account);
    });
}