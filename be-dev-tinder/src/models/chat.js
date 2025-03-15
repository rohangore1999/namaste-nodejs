const mongoose = require('mongoose');

// Message Schema
// We are only storing the senderId and text as we dont want to store the receiverId
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Chat Schema
const chatSchema = new mongoose.Schema({
  // we are not using senderId and receiveerId as we dont want to restrict to two users
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [messageSchema],
});

// Chat Model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
