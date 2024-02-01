const print = console.log;
const { request, param } = require('../app');
const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/api-features');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newreview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newreview,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const newreview = await Review.find();
  res.status(201).json({
    status: 'success',
    data: {
      review: newreview,
    },
  });
});