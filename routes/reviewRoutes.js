const express=require('express');
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authController');
const { route } = require('./tourRoutes');
const router=express.Router({mergeParams:true});//can access id from other route
//post /tour/234fad/reviews
//post /reviews
router.use(authController.protect);
router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
);
router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user','admin'),reviewController.updateReview)
    .delete(authController.restrictTo('user','admin'),reviewController.deleteReview);
module.exports=router;