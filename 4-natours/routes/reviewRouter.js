const print = console.log;
const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

// router.param('id', tourController.checkId);

router
  .route('/')
  .post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserId, reviewController.createReview)
  .get(reviewController.getAllReviews);

router.
  route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);


module.exports = router;