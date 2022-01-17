const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const hotelSchema = new mongoose.Schema({
  hotelName: {
      type: String,
      required: [true, 'A hotel must have a name'],
      trim: true,
      maxlength: [40, 'A hotel name must have less or equal then 40 characters'],
      minlength: [3, 'A hotel name must have more or equal then 3 characters'],
      sparse:true
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
  price: {
     type: Number,
     required: [true, 'A hotel must have a price']
   },
   imageCover: {
      type: String,
      sparse:true
    },
    images: [{
      type:String,
      sparse:true
    }],
    hotelManager: {
      type: ObjectId,
      ref: "HotelManager"
    },
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
    },
    locations: {
         type: {
           type: String,
           default: 'Point',
           enum: ['Point']
         },
         coordinates: [Number],
         address: String,
         description: String,
       }
})

hotelSchema.index({ locations: '2dsphere' });

const Hotel = mongoose.model("Hotel", hotelSchema)

module.exports = Hotel
