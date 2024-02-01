const print = console.log;
const { request, param } = require('../app');
const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/api-features');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const newreview = await Review.find(filter);
  res.status(201).json({
    status: 'success',
    data: {
      review: newreview,
    },
  });
});

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);