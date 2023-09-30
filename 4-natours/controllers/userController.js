const User = require('../models/userModel');
const APIFeatures = require('../utils/api-features');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            tours: users,
        },
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this is not defined",
    })
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this is not defined",
    })
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this is not defined",
    })
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this is not defined",
    })
};

