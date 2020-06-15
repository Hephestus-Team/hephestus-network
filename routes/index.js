function inMaintenance(req, res, next){
	return res.status(410).send({ message: { page: "This route is under maintenance" } });
}

module.exports = (app, handlers, middleware) => {
	
	// HANDLERS
	let {
		auth,
		accounts,
		friendships,
		posts,
		comments,
		likes,
		pub
	} = handlers;

	//MIDDLEWARES
	let {
		authorization,
		params
	} = middleware;

	app.get("/", async (req, res, next) => {
		res.status(200).send("Express server running !");
	});

	// SPECIAL ROUTES
	app.post("/signup", auth.signup);
	app.post("/login", auth.login);
	app.get("/pub/:user", authorization.jwt, authorization.uniqid, params.user, pub.get);

	// PROFILE ROUTES *
	app.route("/accounts/(:user)?")
		.all(authorization.jwt, authorization.uniqid)
		.get(params.user, accounts.get)
		.patch(accounts.patch);

	// POST ROUTES *
	app.route("/posts/(:post)?")
		.all(authorization.jwt, authorization.uniqid)
		.post(posts.post, params.post, posts.share)
		.get(inMaintenance)
		.patch(params.post, posts.patch)
		.delete(params.post, posts.delete);

	// COMMENT ROUTES *
	app.route("/comments/:post/(:comment)?")
		.all(authorization.jwt, authorization.uniqid) 
		.post(params.post, comments.post, params.comment, comments.reply)
		.patch(params.post, params.comment, comments.patch)
		.delete(params.post, params.comment, comments.delete);
	
	// LIKE ROUTES *
	app.route("/likes/:post/(:comment)?")
		.all(authorization.jwt, authorization.uniqid)
		.post(params.post, likes.post, params.comment, likes.comment)
		.delete(params.post, likes.delete);

	// FRIENDSHIP ROUTES *
	app.route("/friendships/(:user)?")
		.all(authorization.jwt, authorization.uniqid)  
		.post(params.user, friendships.post)
		.patch(params.user, friendships.patch)
		.delete(params.user, friendships.delete);

};