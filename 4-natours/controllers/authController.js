const jwt = require('jsonwebtoken');
// @ts-ignore
const mongoose = require('mongoose');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = id => {
    // @ts-ignore
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// @ts-ignore
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
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

// @ts-ignore
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) getting the token and check if its there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('you are not logged in', 401));
    }
    // 2) verification of the token
    // @ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) check if the user still exist
    // @ts-ignore
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('you are no longer exist', 401));
    }
    // 4) check if user changes password after the token was issued
    // @ts-ignore
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('user changed password login again', 401));
    }

    req.user = freshUser;
    next();
});

// we made this because we cant pass arguments to middleware
// so we wrap the middle ware inside a function
// @ts-ignore
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ex: ['admin','lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('you are not has permission to do this', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) get user using posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('no user found', 404));
    }

    // 2) generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) send it to user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'your password reset token valid for 10 min',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'token sent to email'
        });
    }
    catch (err) {
        user.createPasswordResetToken = undefined;
        user.createPasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('there was an error sending email try again', 500));
    }
    next();
});

exports.resetPassword = async (req, res, next) => {
    // 1) get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ 'passwordResetToken': hashedToken });
    console.log(user);
    // 2) if token not expired and their is user , set the password
    if (!user || user.passwordResetExpires < Date.now()) {
        return next(new AppError('token is invalid or expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) update the changed password for the current user
    // 4) log the user in
    const token = signToken(user._id);
    console.log(token);
    res.status(200).json({
        status: 'success',
        token: token
    });

    next();
};