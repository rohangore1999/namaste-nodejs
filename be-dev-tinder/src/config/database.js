const mongoose = require("mongoose");

connectDB = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET
  );
};

module.exports = connectDB;