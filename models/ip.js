//var moment = require('moment');
var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose");
 var IPSchema = new mongoose.Schema({
    from:String,
    image:String,
    text:String,
    url:String,
    file:String,
    fileName:String,
    createdAt:String
});
 //CNSSchema.plugin(passportLocalMongoose)
 module.exports = mongoose.model("IPChat", IPSchema);