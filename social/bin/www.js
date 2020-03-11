const app = require('../app'), https = require('https'), 
mongoose = require('mongoose'), fs = require('fs'), path = require('path');

app.set('port', normalizePort(process.env.PORT || '3333'));
app.set('env', process.env.ENV || 'development');

const options = {
	key: fs.readFileSync(path.join(__dirname, "..\\credentials\\ssl\\key.pem")),
	cert: fs.readFileSync(path.join(__dirname, "..\\credentials\\ssl\\certificate.pem"))
};

mongoose.connect(require('../credentials/cfg.js').mongo.connection, require('../credentials/cfg.js').mongo.options, (err) => {
	if(err) console.log(`Mongoose connection error <${err}>`);
});

https.createServer(options, app).listen(app.get('port'), () => {
	console.log('Express server started in ' + app.get('env') +
		' mode on https://localhost:' + app.get('port') +
		' ; press Ctrl-C to terminate.');
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