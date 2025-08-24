if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}




const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");//to render files
const methodOverride=require("method-override");
 const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
 const ExpressError = require("./utils/ExpressError.js");
// const  {listingSchema}=require("./Schema.js");
// const Review=require("./models/reviews.js");
// const  {reviewSchema}=require("./Schema.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


// const mongourl="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLAS_URL;


main().then(()=>console.log("connected to db"))
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));//to parse the data

app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

//now session information will get stored in mongoose storgAE Not in local machine
const store=MongoStore.create ({
    mongoUrl:dbUrl,
    crypto : {
        secert:process.env.SECRET, 
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("error in mongoose session store",err)
})

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    expires:Date.now() +7 * 24 *60 *60 *1000,//this is the expire date of cookie 
    maxAge :7 * 24 *60 *60 *1000,
    httpOnly:true,
};


// app.get("/",(req,res)=>{
//     res.send("hii i am root");
// });


app.use(session(sessionOption));
app.use(flash());//this should be before routes


//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());//to store the information of the user in the session
passport.deserializeUser(User.deserializeUser());//to restore the information of the user in the session


app.use((req,res,next)=>{
    res.locals.errorMsg=req.flash("error");
    res.locals.successMsg=req.flash("success");
    res.locals.currUser=req.user;//this is to access user in ejs file(navbar.ejs) 
    //console.log(res.locals.successMsg);
    next();
})


//pbkdf2 hasing algorithm is implemented in our project
// app.get("/demoUser",async (req,res)=>{
//     let fakeUser= new User ({
//         email:"student@gamil.com",
//         username:"sigma-student"
//     });

//   let registeredUser=await  User.register(fakeUser , "helloworld");//to register the user the given instances and password and also checks if username is unique or not
//   res.send(registeredUser);
// })


//to use routes in different file
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
 app.use("/",userRouter);

//for any other request (if any request that doesn't matches the above case then it will execute below one)
//this throws an error if request comes for any non-existing route;
app.use((req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
})

//handling custom errors
app.use((err,req,res,next)=>{
    let {statusCode=500 , message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("app is listening");
})


//<img src="<%= listing.image.url %>" class="card-img-top" alt="<%= listing.title %>">

// app.get("/testListing" , async (req,res)=>{
//  let sampleList=new Listing ({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangute , Goa",
//     contry:"India"
//  });
//  await sampleList.save();
//  console.log("sample saved successful");
//  res.send('Successful testing');
// })