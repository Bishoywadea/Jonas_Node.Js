const print = console.log;
const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/')
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
  .get(reviewController.getAllReviews);


module.exports = router;