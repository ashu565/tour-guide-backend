const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const bookingSchema = new mongoose.Schema({
  userInformation: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  startingDate: {
    type: Date,
    required: true
  },
  endingDate: {
    type: Date,
    required: true
  },
  paymentAmount: {
    type: Double,
    required: true
  },
  guide: {
    type: ObjectId,
    ref: 'Guide'
  },
  hotel: {
    type: ObjectId,
    ref: "Hotel"
  },
  serviceType: {
    type: String,
    required: true,
  },
  service: {
    type: ObjectId,
    refPath: 'serviceType'
  },
  location: {
    type: ObjectId,
    ref: "Location"
  }
}, {
  timestamps: true
})

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking
