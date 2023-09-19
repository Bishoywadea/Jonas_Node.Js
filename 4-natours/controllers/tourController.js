const print = console.log;
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

exports.checkId = (req, res, next, val) => {
    print('checking id ...');
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'not valid id',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    print('checking body ...');
    if (!req.body['name'] || !req.body['price']) {
        print('rejected');
        return res.status(400).json({
            status: 'fail',
            message: 'bad request',
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    print(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours,
        },
    });
};

exports.getTour = (req, res) => {
    const tour = tours.find((el) => el.id === req.params.id * 1);

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
};

// the data from post method is not defined without
// Express but we must use middleware to be able to handle it
// using .body
exports.createTour = (req, res) => {
    // print(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(
        './dev-data/data/tours-simple.json',
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour here ....>',
        },
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
