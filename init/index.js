const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing.js");

const mongourl="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>console.log("connected to db"))
.catch((err)=>console.log(err));


async function main() {
    await mongoose.connect(mongourl);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj ,owner:"68974d17105ab81a2df12ed9"
    }));
    await Listing.insertMany(initData.data);
   console.log("data added sucessfully");
}

initDB();