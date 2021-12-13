const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const hotelSchema = new mongoose.Schema({
    photo:String,
    description:{
        type:String,
    },
    hotel: [{
      type:ObjectId,
      ref: "Hotel"
    }]
})

const HotelManager = mongoose.model("HotelManager",hotelSchema)

module.exports = HotelManager
