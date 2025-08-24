const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
// const { route } = require("./listing");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controller/user.js")


router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup))


router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
  passport.authenticate("local",{ failureRedirect : '/login' ,failureFlash : true}) ,(userController.login))


//render form
//router.get("/signup",userController.renderSignup);


//signup
//router.post("/signup",wrapAsync(userController.signup));


//router.get("/login",userController.renderLogin);


//passport.authenticate  is a middleware to authenticate request
//here failureRedirect : '/login' --it redirect's to the login page if we enter wrong password or username and failureFlash : true sends a flash message
//router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect : '/login' ,failureFlash : true}) ,(userController.login));


//logout-->req.logout function is already  defined in passport which takes one callback function
router.get("/logout",userController.logout)


module.exports=router;