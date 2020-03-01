const express = require('express'), app = express();
const Cors = require('cors'), passport = require('passport'), strategy = require('./strategies/main');

app.use(require('morgan')('dev'));
app.use(require('helmet')());
app.use(Cors('http://localhost:3000'));

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
