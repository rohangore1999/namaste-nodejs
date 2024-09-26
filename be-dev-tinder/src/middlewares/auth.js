const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the request cookies and valid the token and also find the user and return to next response
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Please Login")
    }

    const decoddedObj = jwt.verify(token, "secret_key"); // jwt.verify will return the value which we hide during siging token
    const { id } = decoddedObj;

    if (!id) {
      throw new Error("User not found");
    }

    const user = await User.findById(id);

    // as we found user, attach this use in req
    req.user = user

    // as this is middleware, using next we are sending data to next req.
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
};

module.exports = {
  userAuth,
};
