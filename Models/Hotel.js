const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const hotelSchema = new mongoose.Schema({
    userInformation: {
       type: ObjectId,
       ref: "User"
    },
    photo:String,
    description:{
        type:String,
        required:true
    },
    location: [{
      type:ObjectId,
      ref: "location"
    }]
})

const Hotel = mongoose.model("Hotel",hotelSchema)

module.exports = Hotel
