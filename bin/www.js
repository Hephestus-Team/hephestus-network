const app = require("../app");
const https = require("https");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { mongo: mongoConfig, jwt: jwtConfig } = require("../credentials/cfg");

app.set("port", normalizePort(process.env.PORT || "3333"));
app.set("env", process.env.ENV || "development");

const options = {
	key: fs.readFileSync(path.join(__dirname, "..\\credentials\\ssl\\key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "..\\credentials\\ssl\\certificate.pem")).toString()
};

https.createServer(options, app).listen(app.get("port"), () => {
	console.log("API server started in " + app.get("env") +
		" mode on https://localhost:" + app.get("port") +
		" ; press Ctrl-C to terminate.");

	mongoose.connect(mongoConfig.uri, mongoConfig.options, (err) => {
		if (err) return console.log(err);
		return console.log("Mongoose connected");
	});

});

function normalizePort(val) {
	let port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}
