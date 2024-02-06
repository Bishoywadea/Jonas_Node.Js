const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required field'],
    },
    email: {
        type: String,
        required: [true, 'email is required field'],
        unique: true,
        lowercase: true,
        // @ts-ignore
        validate: [validator.isEmail, 'email is not valid']
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'guide', 'lead-guide', 'admin']
    },
    password: {
        type: String,
        required: [true, 'password is required field'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'confirm password is required field'],
        // this will only work for save
        // so whenever we want to update the user
        // we must user save not findAndUpdate
        validate: [function (el) {
            return this.password === el;
        },
            'the 2 passwords is not the same']
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// // @ts-ignore
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     // @ts-ignore
//     this.passwordConfirm = undefined;
//     next();
// });

// // @ts-ignore
// userSchema.pre('save', function (next) {
//     if (!this.isModified('password') || this.isNew) return next();
//     // @ts-ignore
//     this.passwordChangedAt = Date.now() - 1000;
//     next();
// });

// @ts-ignore
userSchema.pre('/^find/', function (next) {
    // this points to the current query
    this.find({ active: true });
    next();
});

userSchema.methods.correctpassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        // @ts-ignore
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken }, this.passwordResetToken);
    return resetToken;
};

// @ts-ignore
const User = new mongoose.model('User', userSchema);
module.exports = User;