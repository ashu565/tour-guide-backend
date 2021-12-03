const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const validator=require('validator');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        index:true
    },
    lastName:{
        type:String,
        required:true,
        index:true
    },
    contact:{
      type:String,
      required:true
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    role:{
      type:String,
      enum:['Traveller','Guide','Hotel','Admin'],
      default:'Traveller',
      required:true
    },
    specifics:{
      type:ObjectId,
<<<<<<< HEAD
      refPath:"role"
=======
      refPath:"role"
>>>>>>> b5787c885bbf036ab8a0f204ba17ddeed3135ede
    }
})

const User = mongoose.model("User",userSchema)
module.exports = User
