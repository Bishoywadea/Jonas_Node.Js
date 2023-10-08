const User = require('../models/userModel');
const APIFeatures = require('../utils/api-features');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({ active: { $ne: false } });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            tours: users,
        },
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) create error if user post password data
    if (req.body.password || req.body.passwordConfirm)
        return next(new AppError('this route is not for updating password, please use /updateMyPassword', 400));

    // 2) filter the body of the req from unwanted fields
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) update user doc
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody,
        {
            new: true,
            runValidator: true
        });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
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

