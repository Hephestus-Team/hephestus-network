module.exports = (app, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });

    //TODO
    /* Send user uniqid */
    app.post('/signin', handlers.local);
    
    app.post('/signup', handlers.signup);

    //TODO
    /* Send data about friendship */
    app.get('/feed', handlers.jwt, (req, res, next) => {
        res.status(200).send({message: {user: 'This is the feed'}});
    });

    //TODO
    /* Actually using HEADER to pass user's uniqid */
    app.get('/add', handlers.jwt, handlers.add);

    app.get('/accept', handlers.jwt, handlers.accept);

    app.get('/refuse', handlers.jwt, handlers.refuse);
    // IF NOT USE, DELETE !
    // app.get('/socketio', handlers.socketio);
}