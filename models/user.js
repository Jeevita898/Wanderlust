
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema =new Schema ({
    email :{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);//to add username and password for schema
module.exports=mongoose.model("User",userSchema);