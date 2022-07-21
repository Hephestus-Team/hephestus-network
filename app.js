const express = require("express");
const Cors = require("cors");
const helmet = require("helmet");
const app = express();
const morgan = require("./dev/morgan");
const handlers = require("./routes/handlers");
const middleware = require("./routes/middleware");
const routes = require("./routes");

app.use(morgan.morganChalk);
app.use(helmet());
app.use(Cors("localhost:3000"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("strict routing", true);

routes(app, handlers, middleware);

app.use((req, res, next) => {
	return res.status(404).send({ message: { page: "This page does not exists" } });
});

app.use((err, req, res, next) => {
	console.log(err);
	return res.status(500).send({ message: { server: "Internal error" } });
});

module.exports = app;
