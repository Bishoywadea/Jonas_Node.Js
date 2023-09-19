const print = console.log;
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userROutes');

const app = express();

//////////////////////////////
/////////MIDDLEWARES//////////
//////////////////////////////

app.use(morgan('dev'));

// "express.json()" is called middleware
// this "use" function is to add middleware to the stack
// that will be applied to every request
app.use(express.json());

// this is our custom middleware
app.use((req, res, next) => {
  print('hello from the middleware in the begin of program');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


//////////////////////////////
////////////ROUTES////////////
//////////////////////////////

// it is calling mounting the routers
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

module.exports = app;
