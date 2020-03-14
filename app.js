const express = require('express'), app = express(),
	Cors = require('cors'), passport = require('passport'),
	strategy = require('./strategies/main'), morgan = require('./dev/morgan'),
	helmet = require('helmet');
	//  handlebars = require('express-handlebars').create({
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
app.use(Cors('http://localhost:3000'));

// app.use(express.static(__dirname + '/public'));
// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(strategy.signin);
passport.use(strategy.jwt);

require('./routes/main')(app, passport, require('./handlers/main'));

app.use((req, res, next) => {
	res.status(404).send({message: "This page doesnt exists"});
});

app.use((req, res, next) => {
	res.status(500).send({message: "Server error"});
});

module.exports = app;
