const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const  {listingSchema}=require("../Schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn ,isOwner ,validateListing  }=require("../middleware.js") 


const  listingController=require("../controller/listing.js");


const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer ({storage})//here multer creates uploads folder and stores the file

router.route ("/")
.get(wrapAsync(listingController.index))
 .post( isLoggedIn,validateListing ,upload.single("listing[image]"),wrapAsync(listingController.create));





//new route
//here we created isLoggedIn middleware to authenticate
//console.log(req.user)---when user get's logged in request object stores the user  informantion in it
router.get("/new",isLoggedIn,listingController.renderNewform);

//serch
router.get("/search" ,wrapAsync(listingController.search))

//fiter
router.
get("/category/:category" ,wrapAsync(listingController.filtering));

router.
route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner ,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner ,wrapAsync(listingController.destroy))



//index route
//router.get("/",wrapAsync(listingController.index));





 //show route
//router.get("/:id" ,wrapAsync(listingController.show));


//create route
//router.post("/", isLoggedIn,validateListing ,wrapAsync(listingController.create));



 //edit route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync(listingController.renderEdit));



 //update route
//router.put("/:id",isLoggedIn,isOwner ,validateListing,wrapAsync(listingController.update));



 //delete route
//router.delete("/:id",isLoggedIn,isOwner ,wrapAsync(listingController.destroy));




module.exports=router;