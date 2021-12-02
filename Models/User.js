const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
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
        required:true
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
      refPath:"role"
    }
})

const User = mongoose.model("User",userSchema)
module.exports = User
