const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

// Models
const User = require("../models/user");

// Utils
const { validateSignupData } = require("../utils/validations");

// Logout
authRouter.post("/logout", async (req, res) => {
  // expiring the cookie from current time
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout Successfully");
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // find user via email
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password); // validatePassword  -> is the mongoose schema method

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    // Password is valid
    // create jwt token
    const token = await user.getJwtToken(); // getJwtToken -> is the mongoose schema method

    // adding jwtToken in response header
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    res.cookie("token", token, { expires: new Date(Date.now() + oneDay) });

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

// Signup - Add the user
authRouter.post("/signup", async (req, res) => {
  try {
    // Adding Validation
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // encrypt password
    const passwordHashed = await bcrypt.hash(password, 10); // 10 round of salt

    // creating instance of new User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHashed,
    });

    // getting the saved user
    const savedUser = await user.save();

    // getting the token and storing it in cookie
    const token = await user.getJwtToken(); // getJwtToken -> is the mongoose schema method

    // adding jwtToken in response header
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    res.cookie("token", token, { expires: new Date(Date.now() + oneDay) });

    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

module.exports = authRouter;
