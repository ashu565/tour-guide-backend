const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const travellerSchema = new mongoose.Schema({
    userInformation:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    pic:{
      type:String,
    },
    description:{
        type:String
    },
    bookingHistory:[{
        type:ObjectId,
        ref:"Booking",
        required:true
    }],
    currentBookings:[{
      type:ObjectId,
      ref:"Booking",
      required:true
    }]
},)

const Traveller = mongoose.model("Traveller",travellerSchema)

module.exports = Traveller
