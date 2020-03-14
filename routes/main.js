module.exports = (app, passport, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });
    
    app.post('/signin', (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, account, info) => {
            if(err) { return res.status(500).send(err); }
            if(!account) { return res.status(303).send(info); }
            return res.status(200).send(info);
        })(req,res,next);        
    });
    
    app.post('/signup', handlers.signup);
    
    app.get('/feed', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, account, info) => {
            if(err) { return res.status(500).send(err); }
            if(!account) { return res.status(401).send(info); }
            return res.status(200).send(info);
        })(req,res,next);
    });
    
    app.get('/socketio', handlers.socketio);
}