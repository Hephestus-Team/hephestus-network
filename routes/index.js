module.exports = (app, handlers) => {
	app.get("/", (req, res, next) => {
		res.status(200).send("Express server running !");
	});

	app.get("/u/(:uniqid)?", handlers.Post.jwt, handlers.Post.uniqid, handlers.Post.relationship, handlers.Get.profile);
	app.get("/publish/:uniqid", handlers.Post.jwt, handlers.Get.publish);

	app.post("/signup", handlers.Post.signup);
	app.post("/signin", handlers.Post.local);
	app.post("/add", handlers.Post.jwt, handlers.Post.uniqid, handlers.Post.add);
	app.post("/publish", handlers.Post.jwt, handlers.Post.uniqid, handlers.Post.publish);
	app.post("/like/:type", handlers.Post.jwt, handlers.Post.uniqid, handlers.Post.like);
	app.post("/comment/(:type)?", handlers.Post.jwt, handlers.Post.uniqid, handlers.Post.comment);
	app.post("/share", handlers.Post.jwt, handlers.Post.uniqid, handlers.Post.share);

	app.delete("/add/:uniqid", handlers.Post.jwt, handlers.Post.uniqid, handlers.Delete.add);
	app.delete("/publish/:uniqid", handlers.Post.jwt, handlers.Post.uniqid, handlers.Delete.publish);
	app.delete("/like/:post/(:comment)?", handlers.Post.jwt, handlers.Post.uniqid, handlers.Delete.like);
	app.delete("/comment/:uniqid", handlers.Post.jwt, handlers.Post.uniqid, handlers.Delete.comment);

	app.patch("/add", handlers.Post.jwt, handlers.Post.uniqid, handlers.Patch.add);
	app.patch("/publish", handlers.Post.jwt, handlers.Post.uniqid, handlers.Patch.publish);
	app.patch("/u/(:uniqid)?", handlers.Post.jwt, handlers.Post.uniqid, handlers.Patch.profile);
	app.patch("/comment", handlers.Post.jwt, handlers.Post.uniqid, handlers.Patch.comment);
};