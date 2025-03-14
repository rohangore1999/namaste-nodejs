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
    socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
      // reason for creating a roomId, So that the chats should not mix up and identical for both users
      // So that the roomId is consistent for both (target and current) users
      const roomId = [userId, targetUserId].sort().join('_');

      console.log(firstName + ' joins chat roomId:' + roomId);

      // joining the room
      socket.join(roomId);
    });

    socket.on('sendMessage', ({ firstName, userId, targetUserId, text }) => {
      console.log(firstName + ' sends a message ' + text);

      // creating a roomId
      const roomId = [userId, targetUserId].sort().join('_');

      // emitting the message to the target user
      io.to(roomId).emit('receiveMessage', {
        firstName,
        userId,
        targetUserId,
        text,
      });
    });

    socket.on('disconnect', (data) => {
      socket.leave(roomId);
    });
  });
};

module.exports = initializeSocket;
