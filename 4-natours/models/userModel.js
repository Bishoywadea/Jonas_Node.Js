const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    password: {
        type: String,
        required: [true, 'password is required field'],
        minlength: 8
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
});

// @ts-ignore
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        // @ts-ignore
        this.passwordConfirm = undefined;
    }
    next();
});

// @ts-ignore
const User = new mongoose.model('User', userSchema);
module.exports = User;