const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const travellerSchema = new mongoose.Schema({
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
