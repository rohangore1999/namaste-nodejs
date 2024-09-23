const express = require("express");
const userRouter = express.Router();

// Middleware
const { userAuth } = require("../middlewares/auth");

// Models
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Get all the pending requests
userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // From the connectionRequest model find the request which has toUserID as loggedInUser._id

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested", // only need data of others who are interested in us
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Request Fetched Successfully",
      data: pendingRequests,
    });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

// Get all the accepted requests
userRouter.get("/user/request/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // find the loggedInUser Id in fromUserId or toUserId and status is accepted
    const acceptedConnections = await ConnectionRequest.find({
      $or: [ // A accepts B or B accpets A, Both should be visible
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    // The loggedInUser can be either in fromUserId or toUserId
    const data = acceptedConnections.map((row) => {
      // checking if the loggedInUser is fromUserId then return the toUserId else return fromUserId
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({
      message: "Data fetched Successfully",
      data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

// Get all the Feeds
userRouter.get("/feeds", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit; // here we are restricting user to send limit at max 50
    const skip = (page - 1) * limit;
    /**
     * page=1&limit=10 => 1-10 => skip(0) limit(10)
     * page=2&limit=10 => 11-20 => skip(10) limit(10)
     */

    // find the users to whom we have sent/receive the request.
    const userToHideData = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id }, 
        { toUserId: loggedInUser._id }
      ],
    }).select(["fromUserId", "toUserId"]);

    // As there can be duplicate ids .i.e one use can send req to mutiple people, so using New Set we will remove duplicates
    const hideUserSet = new Set();

    userToHideData.map((user) => {
      hideUserSet.add(user.fromUserId.toString());
      hideUserSet.add(user.toUserId.toString());
    });

    // hideUserSet will contains the ids which we dont want to show in feeds from User db
    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserSet) } }, // "not in" hideUserSet
        { _id: { $ne: loggedInUser._id } }, // "not equal" to loggedInUser id
      ],
    })
      .select(["firstName", "lastName"])
      .skip(skip)
      .limit(limit); // it will skip the records and set the limit

    res.send(feedData);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

module.exports = userRouter;
