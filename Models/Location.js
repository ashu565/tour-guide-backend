const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const LocationSchema = new mongoose.Schema({
  locationName: {
      type: String,
      required: [true, 'A tour or hotel must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour or hotel name must have less or equal then 40 characters'],
      minlength: [3, 'A tour or hotel name must have more or equal then 3 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
  price: {
     type: Number,
     required: [true, 'A tour or hotel must have a price']
   },
   imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
  guide: {
    type: ObjectId,
    ref: "Guide"
  },
  tourGuideDescription: {
      type: ObjectId,
      ref: "tourGuideDescription"
  },
  hotel: {
    type: ObjectId,
    ref: "Hotel"
  },
  hotelDescription: {
    type: ObjectId,
    ref: "hotelDescription"
  },
  serviceType: {
    type: String,
    required: true,
  },
  service: {
    type: ObjectId,
    refPath: "serviceType"
  },
  startLocation: {
     // GeoJSON
     type: {
       type: String,
       default: 'Point',
       enum: ['Point']
     },
     coordinates: [Number],
     address: String,
     description: String
   },
  locations: [
     {
       type: {
         type: String,
         default: 'Point',
         enum: ['Point']
       },
       coordinates: [Number],
       address: String,
       description: String,
       day: Number
     }
   ],
   bookingHistory:[{
       type:ObjectId,
       ref:"Booking",
       required:true
   }],
   currentBooking:[{
       type:ObjectId,
       ref:"Booking",
       required:true
   }]
})

const Location = mongoose.model("Location", locationSchema)

module.exports = Location
