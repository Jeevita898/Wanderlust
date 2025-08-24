
const Listing=require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const  {listingSchema}=require("./Schema.js");
const  {reviewSchema}=require("./Schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn =((req,res,next) => {
  //console.log(req.user)
 if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl; 
      // console.log(req.originalUrl)
      req.flash("error","you must be logged in to create listing");
      return res.redirect("/login");
    }
    next();
})

//once the isLoggedin middleware redirects  to login page then redirectUrl which is saved becomes undefined so we have to store it as locals to access the url
module.exports .saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    console.log("hii");
  }
  next();
}



//to stop from different user to edit the listing except owner
module.exports .isOwner = async (req,res,next) =>{
  let { id}=req.params;
  let listing=await Listing.findById(id);
  if( !listing.owner._id.equals (res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



//to validate listing using middleware
module.exports .validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}




//to validate review using middleware
module.exports .validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//to check author of the review
module.exports .isReviewAuthor= async (req,res,next) =>{
  let {id, reviewid}=req.params;
  let review=await Review.findById(reviewid);
  if( !review.author.equals (res.locals.currUser._id)){
        req.flash("error","You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
