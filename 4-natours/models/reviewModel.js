const print = console.log
const mongoose = require('mongoose');
const slugify = require('slugify');

// create a schema 
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A Review cant be empty']
  },
  rating: {
    type: Number,
    min: [1, 'rating must be > 1'],
    max: [5, 'rating must be <= 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A Review must has tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A Review must has reviewer']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // @ts-ignore
  // this.populate({
  //   path: 'user',
  //   select: 'name photo'
  // }).populate({
  //   path: 'tour',
  //   select: 'name'
  // });
  // next();
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;