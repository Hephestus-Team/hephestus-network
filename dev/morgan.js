const morgan = require("morgan"), chalk = require("chalk");

const  morganChalk = morgan((tokens, req, res) => {

	let statusCode = "/" + tokens.status(req, res) + "/";
	let route = tokens.url(req, res).match(/[^/]+(?=\/)/);

	route = route ? route[0].toUpperCase() : "ANOTHER";

	let url = tokens.url(req, res);
	let method = tokens.method(req, res);
	let response = tokens["response-time"](req, res) + " ms";

	return [
		chalk.yellow.bold(statusCode),
		chalk.magenta.bold(route),
		chalk.white(url),
		chalk.green.bold(method),
		chalk.white(response)
	].join(" ");
});

module.exports = {
	morganChalk
};