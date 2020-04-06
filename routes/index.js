module.exports = (app, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });

    app.post('/signup', handlers.signup);

    app.post('/signin', handlers.local);

    app.get('/profile', handlers.jwt, handlers.profile);

    app.get('/u/(:uniqid)?', handlers.jwt, handlers.profile);

    app.post('/add', handlers.jwt, handlers.add);

    app.post('/accept', handlers.jwt, handlers.accept);

    app.post('/refuse', handlers.jwt, handlers.refuse);
    
    app.post('/publish', handlers.jwt, handlers.publish);

    app.post('/like/:type', handlers.jwt, handlers.like);

    app.post('/comment', handlers.jwt, handlers.comment);

    app.post('/share', handlers.jwt, handlers.share);
}