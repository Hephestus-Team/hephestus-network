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
		likes
	} = handlers;

	//MIDDLEWARES
	let {
		authorization,
		params
	} = middleware;

	app.get("/", (req, res, next) => {
		res.status(200).send("Express server running !");
	});

	// SPECIAL ROUTES
	app.post("/signup", auth["signup"]);
	app.post("/login", auth["login"]);

	// PROFILE ROUTES
	app.route("/accounts/:user")
		.all(authorization)
		.get(params["user"], accounts["getOne"])
		.patch(accounts["edit"]);

	// POST ROUTES
	app.route("/posts/:user/(:post)?")
		.all(authorization, params["user"])
		.post(posts["create"], params["post"], posts["createShare"])
		.get(params["post"], posts["getOne"], posts["getMultiple"])
		.patch(params["post"], posts["edit"])
		.delete(params["post"], posts["delete"]);

	// COMMENT ROUTES
	app.route("/comments/:user/:post/(:comment)?")
		.all(authorization, params["user"], params["post"]) 
		.post(comments["create"], params["comment"], comments["createReply"])
		.patch(params["comment"], comments["edit"])
		.delete(params["comment"], comments["delete"]);
	
	// LIKE ROUTES
	app.route("/likes/:user/:post/(:comment)?")
		.all(authorization, params["user"], params["post"])
		.post(likes["create"], params["comment"], likes["createComment"])
		.delete(params["comment"], likes["delete"]);

	// FRIENDSHIP ROUTES
	app.route("/friendships/:user")
		.all(authorization, params["user"])  
		.post(friendships["send"])
		.patch(friendships["accept"])
		.delete(friendships["refuse"]);

};