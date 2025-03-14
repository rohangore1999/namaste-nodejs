const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');

// To use the .env file
require('dotenv').config();

// Routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');

// Socket
const initializeSocket = require('./utils/socket');

const app = express();

// Middleware
app.use(
  cors({
    // whitelisting the domain so that browser can set the cookie
    origin: 'http://localhost:5173',
    credentials: true,
  })
); // CORS handling

app.use(cookieParser()); // to parse the cookie in JSON obj.

// to parse the json body from request and converts to js object.
// For all routes EXCEPT the webhook route (as we need rawBody), parse JSON
app.use((req, res, next) => {
  if (req.originalUrl === '/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter);

const server = http.createServer(app); // using app we are creating a server

initializeSocket(server);

connectDB()
  .then(() => {
    console.log('DB connection Successful');

    // as using app we are creating server for socket, so listening via server
    server.listen(7777, () => {
      console.log('Server is listening');
    });
  })
  .catch(() => {
    console.error('DB connection falied');
  });
