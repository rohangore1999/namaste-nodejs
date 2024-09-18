const mongoose = require("mongoose");

connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gorerohan15:Rohangore1999@namaste-node.avd97.mongodb.net/devTinder"
  );
};

module.exports = connectDB;