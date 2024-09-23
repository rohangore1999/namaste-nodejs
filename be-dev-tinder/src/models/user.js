const mongoose = require("mongoose");
const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Mongoose Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        // first this validate function will execute and once it returns true then only it will create... NOT applicable while updating existing data
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Enter proper gender: Male | Female | Others");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "http://dummy.com",
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// mongoose schema method
userSchema.methods.getJwtToken = function () {
  const user = this;

  // create jwt token
  // we are hidding the user.id in jwtToken
  const token = jwtToken.sign({ id: user.id }, "secret_key", {
    expiresIn: "1d",
  }); // token will expires in 1 day

  return token;
};

userSchema.methods.validatePassword = async function (userEnteredPassword) {
  const user = this;
  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare(
    userEnteredPassword,
    hashedPassword
  );

  return isPasswordValid;
};

// Creating Mongoose Model
const User = mongoose.model("User", userSchema);
module.exports = User;
