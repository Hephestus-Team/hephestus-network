const mongoose = require('mongoose');

let chatSchema = mongoose.Schema({
    members: [mongoose.ObjectId],
    creator: mongoose.ObjectId,
    created_at: { type: Date, default: Date.now }
});

let messageSchema = mongoose.Schema({
    chat_id: mongoose.ObjectId,
    send_by: mongoose.ObjectId,
    content: String,
    created_at: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
const Chat = mongoose.model('Chat', chatSchema);

exports.Message = Message;
exports.Chat = Chat;