const print = console.log;
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

// when we type an url and it doesn't exist in any routes
// it will search in that directory
app.use(express.static(path.join(__dirname,'public')));

//////////////////////////////
/////////MIDDLEWARES//////////
//////////////////////////////

// set security http headers
// @ts-ignore
app.use(helmet());

// development logging
print(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same api
// @ts-ignore
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 10000,
  message: 'too many req from same id try again after an hour'
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({
  limit: '10kb'
}));

// data sanitization against NoSQL query injection
// example for it in email we can type ({"$gt":""} and correct password it will enter)
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// parameter pollution protector 
// example for it (/api/v1/tours?sort=duration&sort=price)
app.use(hpp({
  whitelist: [
    "duration",
    "ratingsQuantity",
    "ratingsAvg",
    "maxGroupSize",
    "difficulty",
    "price"
  ]
}));



// test middleware
app.use((req, res, next) => {
  // @ts-ignore
  req.requestTime = new Date().toISOString();
  print(req.headers);
  next();
});

//////////////////////////////
////////////ROUTES////////////
//////////////////////////////
app.get('/',(req,res)=>{
  res.status(200).render('base',{
    tour:'The Forest Hiker',
    user:'Bishoy',
  });
})
// it is calling mounting the routers
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`can\'t find ${req.originalUrl} on this server`);
  // @ts-ignore
  err.status = 'fail';
  // @ts-ignore
  err.statusCode = 404;

  // whenever we pass anything to next function 
  // express wil skip all the next middlewares 
  // and go to the global error handling middleware
  next(new AppError(`can\'t find ${req.originalUrl} on this server`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

module.exports = app;
