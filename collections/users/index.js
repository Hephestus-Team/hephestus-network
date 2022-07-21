const mongoose = require("mongoose");

// CREATING SCHEMA FOR USERS COLLECTION
let usersSchema = mongoose.Schema({
	uniqid: {
		type: String,
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
	birthday: {
		type: String,
		required: true
	}, 
	bio: {
		type: String,
		maxlength: 160
	},
	gender: {
		type: String,
		enum: ["m", "f", "o"],
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now,
		required: true
	}
});

// SETING STATICS
usersSchema.statics = require("./statics");

// SETING INDEXES
usersSchema.index({ uniqid: 1, username: 1 }, { unique: 1 });

let Users = mongoose.model("Users", usersSchema, "users");

module.exports = Users;