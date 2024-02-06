const print = console.log
const mongoose = require('mongoose');
const slugify = require('slugify');
const Tour = require('./tourModel');
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

reviewSchema.index({tour:1,user:1},{unique:true});

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

reviewSchema.statics.calcAverageRatings = async function(tourId){
  const stats = await this.aggregate([
    {
      $match:{tour:tourId}
    },
    {
      $group:{
        _id:'tour',
        nRating:{$sum:1},
        avgRating:{$avg:'$rating'}
      }
    }
  ])

  if(stats.length > 0){
    await Tour.findByIdAndUpdate(tourId,{
      ratingsAvg:stats[0].avgRating,
      ratingsQuantity:stats[0].nRating
    });
  }
  else{
    await Tour.findByIdAndUpdate(tourId,{
      ratingsAvg:4.5,
      ratingsQuantity:0

    });
  }
}

reviewSchema.post('save',function(){
  this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre('/^findOneAnd/', async function(next){
  this.r = await this.findOne();
  next();
})


reviewSchema.post('/^findOneAnd/', async function(){
  await this.r.constructor.calcAverageRatings(this.r.tour);
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;