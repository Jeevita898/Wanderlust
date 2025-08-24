
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");


module.exports.createReview =async (req,res)=>{
    console.log(req.params.id);
  let listing=await Listing.findById(req.params.id);//extract the listing using id from the request
  let newReview=new Review (req.body.review);//crete new Review using review object from backend
  newReview.author=req.user._id;
  listing.reviews.push(newReview);//then push the new review ti the listing

  await newReview.save();
  console.log("jooo");
  
  await listing.save();
console.log("kooo");
  console.log("review added");
  req.flash("success","New Review Added")
  res.redirect(`/listings/${listing._id}`);
}




module.exports.destroyReview =async(req,res)=>{
  let { id , reviewid}=req.params;
  console.log(reviewid);
  await Listing.findByIdAndUpdate (id, {$pull :{reviews : reviewid}})//pull operator pulls the reviewid which matches with the id's in the review array 
  await Review.findByIdAndDelete(reviewid);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}