const express = require('express');

const helloRouter = express.Router();

helloRouter.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = helloRouter;
