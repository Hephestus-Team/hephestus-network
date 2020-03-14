const jwt = require('jsonwebtoken'), Account = require('./models/account');
module.exports = (server) => {
    let io = require('socket.io')(server);
    io.on('connection', (socket) => {
        Account.findOne({_id: jwt.decode(socket.handshake.query.jwtToken).id}, (err, account) => {
            if(err) { return socket.emit(err); }
            if(!account) { return socket.emit('UserNotLoggedIn'); }
        });
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });
    });
}