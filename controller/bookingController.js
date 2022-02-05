const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const User = require('../Models/User');
const Booking = require('../Models/Booking');
const AppError = require('../utils/appError');
const Hotel = require('../Models/Hotel');

exports.createBooking = async (req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const { numberOfRooms, numberOfDays } = req.body;
        console.log(numberOfRooms, numberOfDays);
        const rooms = parseInt(numberOfRooms);
        const days = parseInt(numberOfDays);
        const hotel = await Hotel.findById(req.params.id);
        const amount = rooms * days * hotel.price;
        console.log(amount);
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: uuidv4(),
        };
        const order = await instance.orders.create(options);
        if (!order) {
            return next(new AppError('Something went wrong,Please try again'));
        }

        res.status(200).json({
            order,
        });
    } catch (error) {
        console.log(error);
        next(new AppError('Something went wrong, could not place order', 500));
    }
};

exports.confirmBooking = async (req, res, next) => {
    try {
        const {
            amount,
            receipt,
            user,
            course,
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            createdAt,
            startingDate,
            endingDate,
        } = req.body;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');
        console.log(digest, razorpaySignature);
        if (digest !== razorpaySignature) {
            return next(
                new AppError('Transaction not legit!, please try again later'),
                400
            );
        }

        const booking = await Booking.create({
            hotel: req.params.id,
            user: req.user._id,
            paid: true,
            startingDate,
            endingDate,
        });

        res.status(200).json({
            status: 'success',
            message: 'Payment sccessful',
        });
    } catch (error) {
        console.log(error);
        next(
            new AppError('Something went wrong, could not confirm order', 500)
        );
    }
};
