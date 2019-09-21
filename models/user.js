var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
 var UserSchema = new mongoose.Schema({
    username: {type:String, unique : true, required : true},
    email:{type:String, unique : true, required : true},
    isAdmin:{type:String,required:true},
    subject:{type:String},
    status:{type:String},
    imgname :{type:String},
    password:{type:String, required : true}
});
 UserSchema.plugin(passportLocalMongoose)
 module.exports = mongoose.model("User", UserSchema); 