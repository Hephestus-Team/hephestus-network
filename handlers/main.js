var Account = require('../models/account');

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

exports.socketio = (req, res, next) => {
    res.render('index');
}