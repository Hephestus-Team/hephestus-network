module.exports = (app, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });

    app.post('/signup', handlers.signup);

    app.post('/signin', handlers.local);

    app.get('/feed', handlers.jwt, handlers.feed);

    app.get('/profile', handlers.jwt, handlers.feed);

    /* Actually using HEADER to pass user's uniqid */
    app.get('/add', handlers.jwt, handlers.add);

    app.get('/accept', handlers.jwt, handlers.accept);

    app.get('/refuse', handlers.jwt, handlers.refuse);

}