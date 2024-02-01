const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Model } = require('mongoose');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('no document found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true
  });

  if (!doc) {
    return next(new AppError('no document found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    },
  });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});