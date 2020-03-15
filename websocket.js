const jwt = require('jsonwebtoken'), Account = require('./models/account'), Room = require('./models/chat').Room;

//TODO
/* Change events to use uniqid of users and friendship */
/* No need for auth in chat */
module.exports = (server) => {    
    let io = require('socket.io')(server);
    io.on('connection', (socket) => {
        Account.findOne({_id: jwt.decode(socket.handshake.query.jwtToken).id}, (err, account) => {
            if(err) { return console.log(err); }
            if(!account) { return socket.emit('UserNotLoggedIn'); }
            return account._id;
        });

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