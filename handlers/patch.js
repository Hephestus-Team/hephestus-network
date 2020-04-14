let Account = require('../models/account');

exports.add = (req, res, next) => {
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