const express = require('express');

// Middleware
const { userAuth } = require('../middlewares/auth');

// Models
const Chat = require('../models/chat');

const chatsRouter = express.Router();

// Get all chats
chatsRouter.get('/chats/:targetUserId', userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;

    // get the userId from userAuth
    const userId = req.user._id;

    // find the chat between two users (userId and targetUserId)
    const chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .populate({
        path: 'messages.senderId',
        select: 'firstName lastName',
      })
      .populate({
        path: 'participants',
        select: 'firstName lastName',
      }); // as we have user ref in the message schema

    if (!chat) {
      res.json({
        participants: [userId, targetUserId],
        messages: [],
      });
    }

    res.json(chat);
  } catch (error) {
    console.log({ error });

    res.status(500).send('Internal Server Error');
  }
});

module.exports = chatsRouter;
