const express = require("express");
const requestRouter = express.Router();

// Middlewares
const { userAuth } = require("../middlewares/auth");

// Models
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// One user is sending request(interested | ignored) to other user
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // validations:
      // 1: status: [interested | ignored]
      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Status is invalid");
      }

      // 2: if A -> B already exist; then B not send to A
      const isConnectionRequestExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isConnectionRequestExist) {
        throw new Error("Connection request already exist");
      }

      // 3: toUserId must be present in our DB
      const isToUserIdExist = await User.findById(toUserId);

      if (!isToUserIdExist) {
        throw new Error("User is not present");
      }

      // creating instance of the Model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({ message: "Connection Request Send", data });
    } catch (error) {
      res.status(400).send("ERROR: " + error);
    }
  }
);

// User received the request, now they can either accept it reject the pending request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Validations:
      // 1: Status check
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }

      // 2: RequestId and toUserId exist and loggedIn currently
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Invalid connection");
      }

      // Updating the status
      connectionRequest.status = status;

      // Saving into the DB
      const data = await connectionRequest.save();

      res.json({ message: `Request ${status}`, data });
    } catch (error) {
      res.status(400).send("ERROR: " + error);
    }
  }
);

module.exports = requestRouter;
