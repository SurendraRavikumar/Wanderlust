const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    // username and password fields are automatically defined by passport-local-mongoose package.
    // So no need of defining here.
});


userSchema.plugin(passportLocalMongoose); // Here, we passed it as plugin.Because it will automatically will implement username,hashing,salting and hashed password.

module.exports = mongoose.model('User', userSchema);