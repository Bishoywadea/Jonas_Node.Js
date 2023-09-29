const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `duplicated field value: ${value} use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `invalid input data: ${errors.join(', ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        console.error('error is :::>', err);
        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateErrorDB(err);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

        sendErrorProd(error, res);
    }
}