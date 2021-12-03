const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const bookingSchema = new mongoose.Schema({
    userInformation:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    startingDate:{
      type:Date,
      required:true
    },
    endingDate:{
      type:Date,
      required:true
    },
    paymentAmount:{
      type: Double,
      required:true
    },
    guide:{
      type:ObjectId,
<<<<<<< HEAD
      ref:"Guide"
    },
    hotel:{
      type:ObjectId,
      ref:"Hotel"
=======
      ref:Guide
    },
    hotel:{
      type:ObjectId,
      ref:"Hotel"
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
    location:{
      type:ObjectId,
      ref:"Location"
=======
      refPath:serviceType
    },
    location:{
      type:ObjectId,
      ref:"Location"
>>>>>>> b5787c885bbf036ab8a0f204ba17ddeed3135ede
    }
},{
  timestamps:true
})

const Booking = mongoose.model("Booking",bookingSchema)

module.exports = Booking
