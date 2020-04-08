const mongoose = require('mongoose');

let friendshipSchema = mongoose.Schema({
    _id: String,
    friend: String,
    is_accepted: { type: Boolean, default: false },
    is_sender: Boolean,
    created_at: { type: Date, default: Date.now }
}, { _id: false }),
likeSchema = new mongoose.Schema({
    user: String,
    name: String,
    created_at: { type: Date, default: Date.now }
}, { _id: false}),
shareSchema = new mongoose.Schema({
    user: String,
    name: String,
    post: String,
    created_at: { type: Date, default: Date.now }
}, { _id: false}),
shareMetadataSchema = new mongoose.Schema({
    user: String,
    name: String,
    post: String,
    created_at: { type: Date, default: Date.now }
}, { _id: false}),
replyMetadataSchema = new mongoose.Schema({
    user: String,
    name: String,
    comment: String,
    created_at: { type: Date, default: Date.now }
}, { _id: false}),
commentSchema = new mongoose.Schema({
    uniqid: String,
    user: String,
    name: String,
    content: String,
    is_reply: { type: Boolean, default: false },
    replyMetadata: replyMetadataSchema,
    likes: [likeSchema],
    created_at: { type: Date, default: Date.now }
}, { _id: false }),
postSchema = mongoose.Schema({
    uniqid: String,
    name: String,
    content: String,
    is_share: { type: Boolean, default: false },
    shares: [shareSchema],
    shareMetadata: shareMetadataSchema,
    likes: [likeSchema],
    comments: [commentSchema],
    visibility: { type: Number, default: 1},
    created_at: { type: Date, default: Date.now }
}, { _id: false });

/*
 *  Visibility code:
 *  All users can see the post :: 1
 *  Only friends & friends of friends can see the post :: 2
 *  Only friends can see the post :: 3
 *  Private post :: 4 
 *
 */

module.exports = {
    Friendship: friendshipSchema,
    Comment: commentSchema,
    Post: postSchema
};