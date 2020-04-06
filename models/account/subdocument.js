const mongoose = require('mongoose');

let friendshipSchema = mongoose.Schema({
    _id: String,
    friend: String,
    is_accepted: { type: Boolean, default: false },
    is_sender: Boolean,
    created_at: { type: Date, default: Date.now }
}, { _id: false });

let likeSchema = new mongoose.Schema({
    user: String,
    name: String,
    created_at: { type: Date, default: Date.now }
});

let shareSchema = new mongoose.Schema({
    post: String,
    user: String
});

//TODO
/* Add reply property if the comment is a reply to another comment */
let commentSchema = new mongoose.Schema({
    uniqid: String,
    user: String,
    name: String,
    content: String,
    like: [likeSchema],
    created_at: { type: Date, default: Date.now }
}, { _id: false });

let postSchema = mongoose.Schema({
    uniqid: String,
    name: String,
    content: String,
    is_shared: Boolean,
    share: shareSchema,
    like: [likeSchema],
    comment: [commentSchema],
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