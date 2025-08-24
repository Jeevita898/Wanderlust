const User=require("../models/user.js");

module.exports.renderSignup =(req,res)=>{
  res.render("users/signup.ejs");
}


module.exports .signup =async(req,res)=>{
 try{
let {username ,email ,password}=req.body;
const newUser=new User ({email,username});
const registeredUser=await User.register(newUser,password);
console.log(registeredUser);
req.login(registeredUser ,(err)=>{
   if(err){
     return next(err);
   } 
   else{
    req.flash("success","Welcome to the Wanderlust!");
    res.redirect("/listings");
   }
});
}
  catch(err){
    req.flash("error","A user with the given username is already registered");
    res.redirect("/signup");
  }
}


module.exports.renderLogin=(req,res)=>{
  console.log(req.body)
//  console.log("hii");
 res.render("users/login.ejs");
}

//here login is actually done by the passport , below route is after the successful login
module.exports.login =async(req,res)=>{
  req.flash("success","Welcome back to  Wanderlust! You are logged in");
  let url=res.locals.redirectUrl || "/listings";
  res.redirect(url);
}

module.exports.logout =(req,res,next)=>{
  req.logout((err)=>{
    if(err){
     return next(err)
    }
    req.flash("success","you are logged out");
    res.redirect("/listings");
  })
}