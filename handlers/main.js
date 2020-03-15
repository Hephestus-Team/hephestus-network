var Account = require('../models/account'), jwt = require('jsonwebtoken');

//TODO
/* Create account uniqid and save document */
exports.signup = (req, res, next) => {
    Account.findOne({email: req.body.email}, (err, account) =>{
        if(err) { return console.log(err); }
        if(account) { return res.status(303).send({message: {email: 'User already exists'}}); }

        new Account({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            birthday: new Date(req.body.birthday),
            hash: Account.setHash(req.body.hash)
        }).save();

        return res.status(200).send({message: {email: 'User already exists'}});
    });
}

exports.jwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, account, info) => {
        if(err) { return res.status(500).send(err); }
        if(!account) { return res.status(401).send(info); }
        return res.status(200).send(info);
    })(req, res, next);
}

//Check TODO in /routes
exports.add = (req, res, next) => { 
    if(/^[a-zA-Z0-9]+$/.test(req.query.u)){
        Account.findOne({uniqid: req.query.u}, (err, account) => {
            if(err) { return console.log(err); }
            if(!account){ return res.status(303).send({message: {user: 'User do not exist'}}); }

            return;
        });
        Account.findOne({uniqid: req.header('uniqid'),'friendship.friend': req.query.u}, (err, account) => {
            if(err) { return console.log(err); }
            if(account) { return res.status(303).send({message: {friendship: 'Already friends'}}); }
            
            account.friendship = Account.setFriendship(account.uniqid, req.query.u);

            account.save(null, (err, account) => {
                if(err) { return console.log(err); }

                return;
            });

            return;
        });
    }else{
        res.status(422).send({message: {uniqid: 'Cannot process user id'}});
    }
}

// POST
// incoming..