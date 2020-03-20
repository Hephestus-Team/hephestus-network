const jwt = require('jsonwebtoken'), Account = require('./models/account'), Room = require('./models/chat').Room;

module.exports = (server) => {    
    let io = require('socket.io')(server);
    io.on('connection', (socket) => {

        socket.on('join room', (data) => {
            socket.join(data.friendship.uniqid);
            socket.on('send message', (data) => {
                io.to(data.friendship.uniqid).emit('chat message', msg);
            })
        });

        socket.on('leave room', (data) => {
            socket.leave(data.friendship.uniqid);
        });

    });
}