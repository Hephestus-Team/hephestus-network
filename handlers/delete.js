let Account = require('../models/account');

exports.add = (req, res, next) => {
    Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender, "friendships.is_sender": true}, (err, account) => {
        if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
        if(account) { return res.status(409).send({message: {user: 'Cannot refuse your own request'}});  }

        Account.findOne({uniqid: req.body.receiver, "friendships.friend": req.body.sender}, (err, account) => {
            
            if(err) { console.log(err); res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({message: {user: 'Friendship request does not exist'}}); }

            Account.updateMany({uniqid: [req.body.receiver, req.body.sender], "friendships._id": account.friendships[0]._id}, { $pull: { "friendships": { "_id": account.friendships[0]._id} } }, (err, account) => {
                
                if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
                if(!account) { return res.status(403).send({message: {user: 'Friendship request does not exist'}}); }

                return res.status(200).send({message: {friendship: 'You do not accepted the request'}});
            });

        });
    });
}