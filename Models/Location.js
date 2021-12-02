const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const LocationSchema = new mongoose.Schema({
    location:{
      type:String,
      required:true
    },
    guide:{
      type:ObjectId,
<<<<<<< HEAD
      ref:"Guide"
    },
    Hotel:{
      type:ObjectId,
      ref:"Hotel"
=======
      ref:Guide
    },
    Hotel:{
      type:ObjectId,
      ref:Hotel
>>>>>>> b5787c885bbf036ab8a0f204ba17ddeed3135ede
    },
    serviceType:{
      type:String,
      required:true,
    },
    service:{
      type:ObjectId,
<<<<<<< HEAD
      refPath:"serviceType"
    },
=======
      refPath:serviceType
    }
>>>>>>> b5787c885bbf036ab8a0f204ba17ddeed3135ede
    Amount:{
      type:Double,
      required:true
    }
},)

const Location = mongoose.model("Location",locationSchema)

module.exports = Location
