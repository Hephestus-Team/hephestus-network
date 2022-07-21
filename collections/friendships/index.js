const mongoose = require("mongoose"), uniqid = require("uniqid");

// CREATING FRIENDSHIPS SCHEMA FOR FRIEDNSHIPS COLLECTION
let friendshipsSchema = mongoose.Schema({
	uniqid: {
		type: String,
		default: uniqid.time(),
		required: true
	},
	users: {
		type: [String],
		required: true
	},
	names: {
		type: [String],
		required: true
	},
	is_accepted: {
		type: Boolean,
		default: false
	}
});

// SETING STATICS
friendshipsSchema.statics = require("./statics");

// SETING INDEXES
friendshipsSchema.index({ uniqid: 1, users: 1 }, { unique: 1 });

let Friendships = mongoose.model("Friendships", friendshipsSchema, "friendships");

module.exports = Friendships;