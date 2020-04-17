module.exports = (app, handlers) => {
    app.get('/', (req, res, next) => {
        res.status(200).send('Express server running !');
    });

    app.get('/u/(:uniqid)?', handlers.Post.jwt, handlers.Get.profile);
    app.get('/publish/:uniqid', handlers.Post.jwt, handlers.Get.publish);

    app.post('/signup', handlers.Post.signup);
    app.post('/signin', handlers.Post.local);
    app.post('/add', handlers.Post.jwt, handlers.Post.add);
    app.post('/publish', handlers.Post.jwt, handlers.Post.publish);
    app.post('/like/:type', handlers.Post.jwt, handlers.Post.like);
    app.post('/comment/(:type)?', handlers.Post.jwt, handlers.Post.comment);
    app.post('/share', handlers.Post.jwt, handlers.Post.share);

    app.delete('/add', handlers.Post.jwt, handlers.Delete.add);
    app.delete('/publish', handlers.Post.jwt, handlers.Delete.publish);
    // TO-DO
    // app.post('/comment/(:type)?', handlers.Post.jwt, handlers.Post.comment);
    // app.delete('/like/:type', handlers.Post.jwt, handlers.Post.like);

    app.patch('/add', handlers.Post.jwt, handlers.Patch.add);
    app.patch('/publish', handlers.Post.jwt, handlers.Patch.publish);
    // TO-DO
    // app.patch('/u/(:uniqid)?', handlers.Post.jwt, handlers.Patch.profile);
    // app.patch('/comment/(:type)?', handlers.Post.jwt, handlers.Post.comment);
}