module.exports = (app, passport, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });

    //TODO
    /* Send user uniqid */
    app.post('/signin', (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, account, info) => {
            if(err) { return res.status(500).send(err); }
            if(!account) { return res.status(303).send(info); }
            return res.status(200).send(info);
        })(req,res,next);        
    });
    
    app.post('/signup', handlers.signup);

    //TODO
    /* Send data about friendship */
    app.get('/feed', handlers.jwt);

    //TODO
    /* Alert for the other user to accept the friendship */
    app.get('/add', handlers.jwt, handlers.add);

    // IF NOT USE, DELETE !
    // app.get('/socketio', handlers.socketio);
}