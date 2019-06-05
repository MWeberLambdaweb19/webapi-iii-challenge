// imported modules go here!
const express = require('express');
const cors = require('cors');

// imported files go here!
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

// creating server and connecting to express
const server = express();

// connecting server to various methods/middleware
server.use(express.json());
server.use(logger);
server.use(cors());

// connecting server to imported files
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

// setting basic endpoint
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request. This satisfies the first middleware requirement.`)
  next();
};

module.exports = server;
