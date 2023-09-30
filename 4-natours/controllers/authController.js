const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    // @ts-ignore
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // 1) check if email & password exist
    if (!email || !password) {
        return next(new AppError('please provide email & password', 400));
    }

    // 2) check if user exist & password is correct
    const user = await User.findOne({ email: email }).select('+password');
    const correct = await user.correctpassword(password, user.password);
    if (!user || !correct) {
        return next(new AppError('incorrect email or password', 401));
    }

    // 3) check if everything ok, send token to the client 
    const token = signToken(user._id);
    console.log(token);
    res.status(200).json({
        status: 'success',
        token: token
    });
});