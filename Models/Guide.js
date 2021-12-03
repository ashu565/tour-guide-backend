const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const guideSchema = new mongoose.Schema({
    pic:[String],
    description:{
        type:String,
        required:true
    },
    bookingHistory:[{
        type:ObjectId,
        ref:"Booking",
        required:true
    }]
},)

const Guide = mongoose.model("Guide",guideSchema)

module.exports = Guide
