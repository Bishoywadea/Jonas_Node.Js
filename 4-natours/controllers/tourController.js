const print = console.log;
const { request, param } = require('../app');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/api-features');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvg';
    req.query.fields = 'name,price,ratingsAvg,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        print(err);
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// the data from post method is not defined without
// Express but we must use middleware to be able to handle it
// using .body
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent',
            err: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent',
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent',
        });
    }
};


exports.getTourStats = async (req, res) => {
    try {
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
    } catch (err) {
        print(err);
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};


exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        print(err);
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};