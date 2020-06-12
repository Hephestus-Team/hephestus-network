const mongoose = require("mongoose");

// METADATA
let shareMetadataSchema = new mongoose.Schema({
	user: String,
	name: String,
	post: String
}, { _id: false });

let replyMetadataSchema = new mongoose.Schema({
	user: String,
	name: String,
	comment: String
}, { _id: false });

// ARRAY DATA
let shareSchema = new mongoose.Schema({
	user: String,
	name: String,
	post: {
		type: String,
		sparse: true,
		required: true
	},
	created_at: { type: Date, default: Date.now }
}, { _id: false });

let historySchema = new mongoose.Schema({
	content: String,
	modified_at: { type: Date }
}, { _id: false });

// SUBDOCUMENT
let friendshipSchema = mongoose.Schema({
	uniqid: {
		type: String,
		sparse: true,
		required: true
	},
	friend: {
		type: String,
		required: true
	},
	is_accepted: { type: Boolean, default: false },
	is_sender: Boolean,
	created_at: { type: Date, default: Date.now }
}, { _id: false });

let likeSchema = new mongoose.Schema({
	user: {
		type: String,
		sparse: true,
		required: true
	},
	name: String,
	created_at: { type: Date, default: Date.now }
}, { _id: false });

let commentSchema = new mongoose.Schema({
	uniqid: {
		type: String,
		required: true,
		sparse: true
	},
	user: {
		type: String,
		required: true,
		sparse: true
	},
	name: {
		type: String
	},
	content: {
		type: String,
		required: true,
		maxlength: 280
	},
	is_reply: { type: Boolean, default: false },
	replyMetadata: replyMetadataSchema,
	likes: [likeSchema],
	history: [historySchema],
	created_at: { type: Date, default: Date.now }
}, { _id: false });

let postSchema = mongoose.Schema({
	uniqid: {
		type: String,
		required: true,
		sparse: true,
	},
	content: {
		type: String,
		required: true,
		maxlength: 280
	},
	is_share: { type: Boolean, default: false },
	shares: [shareSchema],
	shareMetadata: shareMetadataSchema,
	likes: [likeSchema],
	comments: [commentSchema],
	visibility: { type: Number, default: 1 },
	history: [historySchema],
	created_at: { type: Date, default: Date.now }
}, { _id: false });

/*
 *  Visibility code:
 *  All users can see the post :: 1
 *  Only friends & friends of friends can see the post :: 2
 *  Only friends can see the post :: 3
 *  Private post :: 4 
 */

module.exports = {
	Friendship: friendshipSchema,
	Comment: commentSchema,
	Post: postSchema
};