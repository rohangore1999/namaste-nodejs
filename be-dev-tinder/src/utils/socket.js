const socket = require('socket.io');

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173', // allow the origin for CORS
    },
  });

  // Listen to the connection event
  io.on('connection', (socket) => {
    // handles the event when the user is connected

    // will get joinChat event from the client
    socket.on('joinChat', (data) => {});

    socket.on('sendMessage', (data) => {});

    socket.on('disconnect', (data) => {});
  });
};

module.exports = initializeSocket;
