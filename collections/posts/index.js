const mongoose = require("mongoose"), uniqid = require("uniqid");

// METADATA
let shareMetadataSchema = new mongoose.Schema({
	poster: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	uniqid: {
		type: String,
		required: true
	}
}, { _id: false });

let replyMetadataSchema = new mongoose.Schema({
	commentator: String,
	name: String,
	uniqid: String
}, { _id: false });

// ARRAY DATA
let sharesSchema = new mongoose.Schema({
	poster: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	uniqid: {
		type: String,
		required: true
	},
	created_at: { 
		type: Date, 
		default: Date.now 
	}
}, { _id: false });

let historySchema = new mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	modified_at: { 
		type: Date,
		default: Date.now, 
		required: true 
	}
}, { _id: false });

let likesSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	created_at: { type: Date, default: Date.now }
}, { _id: false });

let commentsSchema = new mongoose.Schema({
	uniqid: {
		type: String,
		default: uniqid.time(),
		required: true
	},
	commentator: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true,
		maxlength: 280
	},
	is_reply: { 
		type: Boolean, 
		default: false 
	},
	replyMetadata: replyMetadataSchema,
	likes: [likesSchema],
	history: [historySchema],
	created_at: { type: Date, default: Date.now }
}, { _id: false });

// CREATING SCHEMA FOR POSTS COLLECTION
let postsSchema = mongoose.Schema({
	uniqid: {
		type: String,
		default: uniqid.time(),
		required: true
	},
	poster: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true,
		maxlength: 280
	},
	comments: [commentsSchema],
	likes: [likesSchema],
	shares: [sharesSchema],
	is_share: {
		type: Boolean,
		default: false,
		required: true
	},
	shareMetadata: shareMetadataSchema,
	created_at: {
		type: Date,
		default: Date.now,
		required: true
	}
});

// SETING STATICS
postsSchema.statics = require("./statics");

// SETING INDEXES
postsSchema.index({ poster: 1, created_at: -1, uniqid: 1 }, { unique: 1 });
postsSchema.index({ "comments.commentator": 1, "comments.created_at": -1, "comments.uniqid": 1 }, { unique: 1, sparse: 1 });

let Posts = mongoose.model("Posts", postsSchema, "posts");

module.exports = Posts;