const print = console.log;
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userROutes');

const app = express();

//////////////////////////////
/////////MIDDLEWARES//////////
//////////////////////////////
print(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// when we type an url and it doesn't exist in any routes
// it will search in that directory
app.use(express.static(`${__dirname}/public`));

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
