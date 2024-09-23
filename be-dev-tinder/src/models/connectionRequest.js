const mongoose = require("mongoose");

// Mongoose Schema
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, // Mongoose _id
      require: true,
      ref: "User", // fromUserId is reference to User collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId, // Mongoose _id
      require: true,
      ref: "User", // fromUserId is reference to User collection
    },
    status: {
      type: String,
      enums: ["ignored", "interested", "accepted", "rejected"],
      message: "{VALUE} is incorrect status type",
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index as we are quering on fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Adding Middleware on Schema using pre on "save" event
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send request to yourself");
  }

  next(); // as this is middleware, we have to move to next function
});

// Creating Mongoose Model
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
