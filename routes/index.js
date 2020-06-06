module.exports = (app, handlers, middleware) => {
	let {
		auth,
		profile,
		friendship,
		publish,
		comment,
		like,
		share
	} = handlers;

	app.get("/", (req, res, next) => {
		res.status(200).send("Express server running !");
	});

	// SPECIAL ROUTES
	app.post("/signup", auth.signup);
	app.post("/signin", auth.signin);
	app.post("/share/:uniqid", middleware.jwt, middleware.uniqid, share.post);

	// PROFILE ROUTES
	app.route("/u/(:uniqid)?")
		.all(middleware.jwt, middleware.uniqid)
		.get(profile.get)
		.patch(profile.patch);

	// POST ROUTES
	app.route("/publish/(:uniqid)?")
		.all(middleware.jwt, middleware.uniqid)
		.post(publish.post)
		.get(publish.get)
		.patch(publish.patch)
		.delete(publish.delete);

	// COMMENT ROUTES
	app.route("/comment/:post/(:comment)?")
		.all(middleware.jwt, middleware.uniqid) 
		.post(comment.post)
		.patch(comment.patch)
		.delete(comment.delete);
	
	// LIKE ROUTES
	app.route("/like/:post/(:comment)?")
		.all(middleware.jwt, middleware.uniqid)
		.post(like.post)
		.delete(like.delete);

	// FRIENDSHIP ROUTES
	app.route("/add/:uniqid")
		.all(middleware.jwt, middleware.uniqid)  
		.post(friendship.post)
		.patch(friendship.patch)
		.delete(friendship.delete);

};