const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const travellerSchema = new mongoose.Schema({
    description:{
        type:String
    },
    bookingHistory:[{
        type:ObjectId,
        ref:"Booking",
    }],
    currentBookings:[{
      type:ObjectId,
      ref:"Booking",
    }]
},)

const Traveller = mongoose.model("Traveller",travellerSchema)

module.exports = Traveller
