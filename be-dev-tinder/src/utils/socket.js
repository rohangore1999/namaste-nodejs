const socket = require('socket.io');

// Models
const Chat = require('../models/chat');

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

    socket.on('sendMessage', async ({ firstName, userId, targetUserId, text }) => {
      try {
        console.log(firstName + ' sends a message ' + text);

        // creating a roomId
        const roomId = [userId, targetUserId].sort().join('_');

        // saving the message to the database
        // 1st msg or existing chat

        // $all -> check if all the participants should be present in the chat
        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

        if (!chat) {
          // create a new chat
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [], // as it is a new chat
          });
        }

        // adding the messeges to existing chat
        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

        // emitting the message to the target user
        io.to(roomId).emit('receiveMessage', {
          firstName,
          userId,
          targetUserId,
          text,
        });
      } catch (e) {
        console.log({ e });
      }
    });

    socket.on('disconnect', (data) => {});
  });
};

module.exports = initializeSocket;
