const print = console.log;
const { request, param } = require('../app');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/api-features');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvg';
    req.query.fields = 'name,price,ratingsAvg,summary,difficulty';
    next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
    // Execute Query
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limiting().paginate();
    const tours = await features.query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours,
        },
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    //note this populate is effecting performance on large scale
    const tour = await Tour.findById(req.params.id).populate('reviews');

    if (!tour) {
        return next(new AppError('no tour found with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
});


// the data from post method is not defined without
// Express but we must use middleware to be able to handle it
// using .body
exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true
    });

    if (!tour) {
        return next(new AppError('no tour found with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        },
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError('no tour found with that id', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAvg: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: '$difficulty',
                //this will add 1 to every document
                numOfTours: { $sum: 1 },
                numOfRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAvg' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'easy' } }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        },
    });
});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numToursStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        },
    });
});