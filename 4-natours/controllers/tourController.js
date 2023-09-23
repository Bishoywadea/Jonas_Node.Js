const print = console.log;
const { request, param } = require('../app');
const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvg';
    req.query.fields = 'name,price,ratingsAvg,summary,difficulty';
    next();
}


exports.getAllTours = async (req, res) => {
    try {
        // Build Query
        // 1A) Filtering
        const queryCpy = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryCpy[element]);

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryCpy);
        // this to covert for example lte to $lte
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matched) => {
            return `$${matched}`;
        });
        let query = Tour.find(queryCpy);

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            print(sortBy);
            query = query.sort(sortBy);
        }
        else {
            query = query.sort('-createdAt');
        }

        // 3) Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            print(fields);
            query = query.select(fields);
        }
        else {
            query = query.select('-__v');
        }

        // 4) pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        query = query.skip((page - 1) * limit).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if ((page - 1) * limit >= numTours) throw new Error('page doesn\'t exist');
        }

        // Execute Query
        const tours = await query;
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
