const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const LocationSchema = new mongoose.Schema({
    location:{
      type:String,
      required:true
    },
    guide:{
      type:ObjectId,
      ref:"Guide"
    },
    hotel:{
      type:ObjectId,
      ref:"Hotel"
    },
    serviceType:{
      type:String,
      required:true,
    },
    service:{
      type:ObjectId,
      refPath:"serviceType"
    },
    Amount:{
      type:Double,
      required:true
    }
},)

const Location = mongoose.model("Location",locationSchema)

module.exports = Location
