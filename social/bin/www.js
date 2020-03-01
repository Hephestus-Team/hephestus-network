const app = require('../app'), http = require('http').createServer(app), 
mongoose = require('mongoose');

app.set('port', normalizePort(process.env.PORT || '3333'));
app.set('env', process.env.ENV || 'development');

var opts = {
    keepAlive: 1,
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

mongoose.connect(require('../credentials.js').mongo.development.connectionString, opts, (err) => {
	if (err) throw new Error(`Mongoose connection error <${err}>`);
});

http.listen(app.get('port'), () => {
	console.log('Express server started in ' + app.get('env') +
		' mode on http://localhost:' + app.get('port') +
		'; press Ctrl-C to terminate.');
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
