const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/api-features');

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

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);

  //note this populate is effecting performance on large scale
  if (populateOptions) query = query.populate(populateOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('no document found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  // made to be able to make nested routes the easy way
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  // Execute Query
  const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limiting().paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  });
});