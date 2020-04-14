let Account = require('../models/account');

exports.profile = (req, res, next) => {
    if(req.header('u') === req.params.uniqid || (req.params.uniqid === undefined && req.header('u'))){

        Account.getProfile(Account, { $or: [ { uniqid: {$in: [req.params.uniqid, req.header("u")]} }, { username: req.params.uniqid } ] }, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' } }); }
            if (!account) { return res.status(403).send({ message: { user: 'User does not exist' } }); }
            
            account.is_friend = false;
            account.is_user = (account.uniqid === req.params.uniqid || account.username === req.params.uniqid) ? true : false;

            return res.status(200).send(account);
        });

    }else{
        Account.findOne({$or: [{uniqid: req.params.uniqid}, {username: req.params.uniqid}]}, (err, account) => {
            if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' }}); }
            if(!account) { return res.status(403).send({ message: { user: 'User does not exist' } }); }

            if(Boolean(account.friendships.filter(friendship => friendship.friend === req.header("u")))) {
                Account.getProfile(Account, { $or: [ { uniqid: {$eq: req.params.uniqid} }, { username: req.params.uniqid } ] }, (err, account) => {
                    if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' } }); }
                    if (!account) { return res.status(403).send({ message: { user: 'User does not exist' } }); }
                    
                    account.is_friend = true;
                    
                    return res.status(200).send(account);
                });

            }else{
                Account.getProfile(Account, { $or: [ { uniqid: {$eq: req.params.uniqid} }, { username: req.params.uniqid } ] }, (err, account) => {
                    if(err) { console.log(err); return res.status(500).send({ message: { database: 'Internal error' } }); }
                    if(!account) { return res.status(403).send({ message: { user: 'User does not exist' } }); }

                    account.is_friend = false;
                    account.is_user = (account.uniqid === req.params.uniqid || account.username === req.params.uniqid) ? true : false;

                    return res.status(200).send(account);
                });
            }
        });
    }
}