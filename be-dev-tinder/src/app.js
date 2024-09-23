const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

// Middleware
app.use(
  cors({
    // whitelisting the domain so that browser can set the cookie
    origin: "http://localhost:5173",
    credentials: true,
  })
); // CORS handling
app.use(express.json()); // to parse the json body from request and converts to js object.
app.use(cookieParser()); // to parse the cookie in JSON obj.

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB connection Successful");

    app.listen(7777, () => {
      console.log("Server is listening");
    });
  })
  .catch(() => {
    console.error("DB connection falied");
  });
