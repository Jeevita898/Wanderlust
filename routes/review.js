const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const  {listingSchema}=require("../Schema.js");
const Review=require("../models/reviews.js");
// const  {reviewSchema}=require("../Schema.js");
const Listing=require("../models/listing.js");
const { validateReview, isLoggedIn ,isReviewAuthor}=require("../middleware.js")


const ReviewController=require("../controller/review.js")

//review route
router.post("/" ,isLoggedIn, validateReview ,wrapAsync(ReviewController.createReview));


//delete review route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync (ReviewController.destroyReview));

module.exports=router;