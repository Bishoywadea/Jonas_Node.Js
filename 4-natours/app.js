const print = console.log;
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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
  // @ts-ignore
  req.requestTime = new Date().toISOString();
  next();
});

//////////////////////////////
////////////ROUTES////////////
//////////////////////////////

// it is calling mounting the routers
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`can\'t find ${req.originalUrl} on this server`);
  // // @ts-ignore
  // err.status = 'fail';
  // // @ts-ignore
  // err.statusCode = 404;

  // whenever we pass anything to next function 
  // express wil skip all the next middlewares 
  // and go to the global error handling middleware
  next(new AppError(`can\'t find ${req.originalUrl} on this server`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

module.exports = app;
