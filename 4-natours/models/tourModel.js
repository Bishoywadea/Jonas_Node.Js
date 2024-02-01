const print = console.log
const mongoose = require('mongoose');
const slugify = require('slugify');

// create a schema 
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'too long for name'],
        minlength: [10, 'too short for name']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'difficulty must be easy or medium or difficult',
        }
    },
    ratingsAvg: {
        type: Number,
        default: 4.5,
        min: [1, 'rating must be > 1'],
        max: [5, 'rating must be <= 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: [function (value) {
            return this.price > value;
        },
            'discount price must be less than original price']
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a imageCover']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        // this will not send this field to the client
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    stratLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

function discountValidator(value) {
    return this.price > value;
};

// this document middleware is called preHook and it is run before .save() and .create()
// @ts-ignore
tourSchema.pre('save', function (next) {
    // @ts-ignore
    this.slug = slugify(this.name, { lower: true });
    next();
});

// query middleware
//tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    // @ts-ignore
    this.find({ secretTour: { $ne: true } });

    next();
});

tourSchema.pre(/^find/, function (next) {
    // @ts-ignore
    this.populate({
        path: 'guides',
        select: '-__v'
    });
    next();
});

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

// create a model out of a schema
// @ts-ignore
const Tour = new mongoose.model('Tour', tourSchema);
module.exports = Tour;