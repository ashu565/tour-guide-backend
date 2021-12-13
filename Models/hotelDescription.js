const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const HotelDescriptionSchema = new mongoose.Schema({
    bed: {
      type: Number,
      required: true
    },
    bathroom: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
},)

const HotelDescription = mongoose.model("hotelDescription",HotelDescriptionSchema)

module.exports = HotelDescription
