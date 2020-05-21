const mongoose = require("mongoose"), subdocument = require("./subdocument"), lib = require("../lib");
let accountSchema = mongoose.Schema({
	uniqid: String,
	first_name: String,
	last_name: String,
	username: String,
	bio: String,
	email: {
		type: String,
		match: [/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
		lowercase: true
	},
	gender: {
		type: String,
		enum: ["m", "f"]
	},
	birthday: Date,
	friendships: [subdocument.Friendship],
	hash: String,
	posts: [subdocument.Post],
	visibility: { type: Number, default: 1 },
	created_at: { type: Date, default: Date.now }
});

lib.load("account", accountSchema);

let Account = mongoose.model("Account", accountSchema);

module.exports = Account;