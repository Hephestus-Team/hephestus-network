const mongoose = require("mongoose"), bcrypt = require("bcrypt"), uniqid = require("uniqid");

// SETING SETTERS
function setHash(value) {
	return bcrypt.hashSync(value, 10);
}

// CREATING SCHEMA FOR LOGIN COLLECTION
let loginSchema = mongoose.Schema({
	uniqid: {
		type: String,
		default: uniqid(),
		required: true
	},
	hash: {
		type: String,
		required: true,
		set: setHash
	},
	email: {
		type: String,
		match: [/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
		lowercase: true,
		required: true
	}
});

// SETING STATICS
loginSchema.statics = require("./statics");

// SETING INDEXES
loginSchema.index({ _id: 1, uniqid: 1, email: 1 }, { unique: 1 });

let Logins = mongoose.model("Logins", loginSchema, "logins");

module.exports = Logins;