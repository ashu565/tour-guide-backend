const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const TourGuideDescriptionSchema = new mongoose.Schema({
  duration: {
   type: Number,
   required: [true, 'A tour must have a duration']
  },
   maxGroupSize: {
     type: Number,
     required: [true, 'A tour must have a group size']
   },
   difficulty: {
     type: String,
     required: [true, 'A tour must have a difficulty'],
     enum: {
       values: ['easy', 'medium', 'difficult'],
       message: 'Difficulty is either: easy, medium, difficult'
     }
   },
   description: {
     type: String,
     required: true
   }
},)

const TourGuideDescription = mongoose.model("tourGuideDescription",TourGuideDescriptionSchema)

module.exports = TourGuideDescription
