const mongoose = require("mongoose"), subdocument = require("./subdocument");
let accountSchema = mongoose.Schema({
	uniqid: { 
		type: String, 
		sparse: true,
		required: true
	},
	first_name: {
		type: String,
		match: [/^[^!-%(-,.-@[-`{-~´\b]+$/],
		required: true
	},
	last_name: {
		type: String,
		match: [/^[^!-%(-,.-@[-`{-~´\b]+$/],
		required: true
	},
	username: {
		type: String,
		maxlength: 15
	},
	bio: {
		type: String,
		maxlength: 160
	},
	email: {
		type: String,
		match: [/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
		lowercase: true,
		required: true
	},
	gender: {
		type: String,
		enum: ["m", "f"],
		required: true
	},
	birthday: {
		type: Date,
		required: true
	},
	friendships: [subdocument.Friendship],
	hash: {
		type: String,
		required: true
	},
	posts: [subdocument.Post],
	visibility: { 
		type: Number,
		required: true,
		default: 1,
		enum: [1, 2, 3, 4]
	},
	created_at: { 
		type: Date, 
		default: Date.now,
		required: true
	}
});

accountSchema.statics = require("./statics");

let Account = mongoose.model("Account", accountSchema);

module.exports = Account;