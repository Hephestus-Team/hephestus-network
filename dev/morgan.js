const morgan = require("morgan"), chalk = require("chalk");

const  morganChalk = morgan((tokens, req, res) => {
	return [
		chalk.yellow.bold("/" + tokens.status(req, res) + "/"),
		chalk.white(tokens.url(req, res)),
		chalk.green.bold(tokens.method(req, res)),
		chalk.white(tokens["response-time"](req, res) + " ms")
	].join(" ");
});

module.exports = {
	morganChalk
};