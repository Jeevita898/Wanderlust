
const Listing=require("../models/listing.js");
const  geocodingClient=require('@maptiler/client');
 const mapToken=process.env.MAPTILER_KEY;
geocodingClient.config.apiKey =mapToken;



module.exports .index =async (req , res ) =>{
    const  allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings,category: "All" });
};


module.exports.renderNewform = async (req,res)=>{
    res.render("./listings/new.ejs");  
}


module.exports.show= async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews", populate:{ 
        path:"author"},
    }).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    else{
        console.log(listing);
    res.render("./listings/show.ejs",{listing})
    }
    
}

module.exports.create= async (req,res,next)=>{
//https://github.com/maptiler/maptiler-client-js/blob/main/examples/test-node.js

const respose = await geocodingClient.geocoding.forward(req.body.listing.location, { limit: 1 });
     console.log(respose.features[0].geometry);
    // res.send("done");

let url=req.file.path;
let filename= req.file.filename;
let newListing=new Listing(req.body.listing);// to create new instance
newListing.owner=req.user._id;
newListing.image={url ,filename};

newListing.geometry=respose.features[0].geometry;

let savedListing=await newListing.save();
console.log(savedListing);

req.flash("success","New Listing Created");
res.redirect("/listings") ;
}


module.exports.renderEdit =async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    else{
        let originalUrl=listing.image.url;
        originalUrl=originalUrl.replace("/upload","/upload/w_250");
        res.render("./listings/edit.ejs",{listing ,originalUrl});
    }
   
}

module.exports.update= async(req,res)=>{
    let { id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   console.log(req.file.path);
//   console.log(req.file.filename);
    if(typeof req.file !== "undefined"){
   let url=req.file.path;
   let filename= req.file.filename;
   listing.image={url ,filename}
   await listing.save();
    }
   

    req.flash("success"," Listing Updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async(req,res)=>{
    let { id}=req.params;
   let DelListing=await Listing.findByIdAndDelete(id);
   console.log(DelListing);
   req.flash("success"," Listing Deleted")
   res.redirect("/listings");
}


//for filters

module.exports.filtering=async (req,res)=>{
    let {category}=req.params;

    //const allListings=await Listing.find({category:category});
     let allListings ;
    if (category === "All") {
        allListings = await Listing.find({});
    } else {
        allListings = await Listing.find({ category: category });
    }
    res.render("./listings/index.ejs" ,{allListings ,category})
}

//for search

module.exports.search=async (req,res)=>{
   const q = req.query.q;
  console.log("search query:", q);

  const listings = await Listing.find({
    $or: [
      { country: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { title: { $regex: q, $options: "i" } },
     
    ]
  });
  if(listings.length == 0){
    return  res.send("Oops! Sorry there is no match for your search , Try with different keyword");
  }
       res.render("./listings/index.ejs", { allListings: listings, searchQuery: q });

  

}