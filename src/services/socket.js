import socketio from 'socket.io-client';

const socket = socketio('https://localhost:3333', {
  autoConnect: false,
});

function receiveNewMessage(newMessageFunction) {
  socket.on('chat message', newMessageFunction);
}

function sendNewMessage(text, friend) {
  socket.emit('chat message', { text, friend });
}

function connectChat(authToken) {
  socket.io.opts.query = { authToken };

  socket.connect();
}

function disconnectChat() {
  if (socket.connected) { socket.disconnect(); }
}

export {
  receiveNewMessage, sendNewMessage, connectChat, disconnectChat,
};
