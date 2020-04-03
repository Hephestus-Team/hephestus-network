const express = require('express'), app = express(),
	Cors = require('cors'), morgan = require('./dev/morgan'),
	helmet = require('helmet');
	//  const handlebars = require('express-handlebars').create({
	// 	defaultLayout: 'main',
	// 	helpers: {
	// 		section: function(name, options){
	// 			if(!this._sections) this._sections = {};
	// 			this._sections[name] = options.fn(this);
	// 			return null;
	// 		}
	// 	}
	// });

app.use(morgan.morganChalk);
app.use(helmet());
app.use(Cors('localhost:3000'));

// app.use(express.static(__dirname + '/public'));
// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars');

/* Need to use form-data for Postman */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app, require('./handlers'));

app.use((req, res, next) => {
	res.status(404).send({message: "This page does not exists"});
});

app.use((req, res, next) => {
	res.status(500).send({message: "Server error"});
});

module.exports = app;
