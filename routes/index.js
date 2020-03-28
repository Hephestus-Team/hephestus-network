module.exports = (app, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });

    app.post('/signup', handlers.signup);

    app.post('/signin', handlers.local);

    app.get('/feed', handlers.jwt, handlers.feed);

    app.get('/profile', handlers.jwt, handlers.feed);

    app.post('/add', handlers.jwt, handlers.add);

    app.post('/accept', handlers.jwt, handlers.accept);

    app.post('/refuse', handlers.jwt, handlers.refuse);
    
    app.post('/publish', handlers.jwt, handlers.publish);
}