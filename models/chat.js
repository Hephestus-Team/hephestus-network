const mongoose = require('mongoose');


//TODO
/* Change roomSchema for uniqid use, instead of mongoose self-id */
let roomSchema = mongoose.Schema({
    members: [mongoose.ObjectId],
    creator: mongoose.ObjectId,
    created_at: { type: Date, default: Date.now }
});

//TODO
/* Change messageSchema for uniqid use, instead of mongoose self-id */
let messageSchema = mongoose.Schema({
    room_id: mongoose.ObjectId,
    send_by: mongoose.ObjectId,
    content: String,
    created_at: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
const Room = mongoose.model('Room', roomSchema);

exports.Message = Message;
exports.Room = Room;