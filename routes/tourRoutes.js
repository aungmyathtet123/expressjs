const express=require('express');
const tourController=require('./../controllers/tourController');
const authController=require('./../controllers/authController'); 
// const {getAllTour,createTour}=require('./../controllers/tourController');
const reviewRouter=require('./../routes/reviewRoutes');
const router=express.Router();
//POST /tour/2345fads/reviews
//GET /tour/2345fads/reviews
//GET /tour/2345fads/reviews/94887fdaa
// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user '),
//         reviewController.createReview
//     );
router.use('/:tourId/reviews',reviewRouter);
router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTour);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan);
// router.param('id',tourController.checkId);
router.param('id',(req,res,next,val)=>{
    console.log(`Tour is is: ${val}`);
    next();
});
router
.route("/")
.get(tourController.getAllTour)
.post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);
// .post(tourController.checkBody,tourController.createTour);

router
.route("/:id/")
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

//POST /tour/2345fads/reviews
//GET /tour/2345fads/reviews
//GET /tour/2345fads/reviews/94887fdaa
// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user '),
//         reviewController.createReview
//     );
module.exports=router;