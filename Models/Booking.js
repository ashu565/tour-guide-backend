const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const bookingSchema = new mongoose.Schema(
    {
        hotel: {
            type: ObjectId,
            ref: 'Hotel',
        },
        user: {
            type: ObjectId,
            ref: 'User',
        },
        paid: {
            type: Boolean,
            default: true,
        },
        startingDate: {
            type: Date,
            required: true,
        },
        endingDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
