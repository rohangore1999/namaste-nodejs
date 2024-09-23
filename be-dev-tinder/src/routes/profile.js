const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

// Middlewares
const { userAuth } = require("../middlewares/auth");

// Utils
const { validateReqBody } = require("../utils/validations");

// View the user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    console.log("LoggedIN user is " + req.user);

    res.send(req.user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // validate the req body
    const isValidRequest = validateReqBody(req.body);

    if (!isValidRequest) {
      throw new Error("Invalid Request");
    }

    // update the existing field and DB
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    // Update the DB
    await loggedInUser.save(); // as loggedInUser is the instance of the user which we have attached in auth (middleware)

    res.json({ message: "Profile Updated Successfully", data: req.user });
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

// Update Password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    // validate the req body
    const isValidReqBody = Object.keys(req.body).includes("password");

    if (!isValidReqBody) {
      throw new Error("Invalid request body");
    }

    const loggedInUser = req.user;

    // encryt the new password
    const encryptedNewPassword = await bcrypt.hash(req.body.password, 10);
    loggedInUser.password = encryptedNewPassword;

    res.json({ message: "Password updated Successfully" });

    // update the DB
    await loggedInUser.save();
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

module.exports = profileRouter;
