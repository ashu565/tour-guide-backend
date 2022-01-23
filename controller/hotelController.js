const User = require('../Models/User');
const AppError = require('../utils/appError');
const Hotel = require('../Models/Hotel');
const Booking = require('../Models/Booking');
const Review = require('../Models/review');
const APIFeatures = require('./../utils/apiFeatures');

exports.getHotelsWithin = async (req, res, next) => {
    try {
        const { distance, latlng } = req.params;
        const [lat, lng] = latlng.split(',');

        const radius = distance / 3963.2; //To convert in radian from KM

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        if (!lat || !lng) {
            next(
                new AppError(
                    'Please provide latitutr and longitude in the format lat,lng.',
                    400
                )
            );
        }

        console.log(lat, lng, page, limit);

        const results = {};
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }

        results.hotels = await Hotel.find({
            locations: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
        })
            .limit(limit)
            .skip(startIndex)
            .exec();

        results.next = {
            page: page + 1,
            limit: limit,
        };

        res.status(200).json({
            status: 'success',
            results: results.hotels.length,
            data: {
                data: results,
            },
        });
    } catch (err) {
        console.log(err);
        return next(
            new AppError(
                'Something went wrong, Could not find Hotels within',
                500
            )
        );
    }
};

exports.getHotelDetails = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        console.log(req.params.id);
        res.status(200).json({
            status: 'Success',
            data: hotel,
        });
    } catch (err) {
        console.log(err);
        return next(
            new AppError(
                'Something went wrong, Could not find Hotels Details',
                500
            )
        );
    }
};

exports.getHotelCurrentBooking = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (req.user.specifics.toString() !== hotel.hotelManager.toString()) {
            return next(new AppError('This hotel doesnt belong to you', 500));
        }
        const bookings = await Booking.find({
            hotel: req.params.id,
            endingDate: { $gte: new Date() },
        });
        res.status(200).json({
            status: 'Success',
            data: bookings,
        });
    } catch (err) {
        console.log(err);
        return next(
            new AppError(
                'Something went wrong, Could not find Hotel Current Bookings',
                500
            )
        );
    }
};

exports.getHotelPastBooking = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (req.user.specifics.toString() !== hotel.hotelManager.toString()) {
            return next(new AppError('This hotel doesnt belong to you', 500));
        }
        const bookings = await Booking.find({
            hotel: req.params.id,
            endingDate: { $lt: new Date() },
        });
        res.status(200).json({
            status: 'Success',
            data: bookings,
        });
    } catch (err) {
        console.log(err);
        return next(
            new AppError(
                'Something went wrong, Could not find Hotel Past Bookings',
                500
            )
        );
    }
};

exports.getAllHotels = async (req, res, next) => {
    try {
        const features = new APIFeatures(Hotel.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const hotels = await features.query;

        // const hotels = await Hotel.find();
        res.status(200).json({
            status: 'Success',
            results: hotels.length,
            data: hotels,
        });
    } catch (err) {
        console.log(err);
        return next(
            new AppError('Something went wrong, Could not find Hotels', 500)
        );
    }
};

exports.getHotelReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 4;

        const results = {};
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }

        results.reviews = await Review.find({
            hotel: req.params.id,
        })
            .limit(4)
            .skip(startIndex)
            .exec();

        results.next = {
            page: page + 1,
            limit: limit,
        };

        res.status(200).json({
            status: 'success',
            results: results.reviews.length,
            data: {
                data: results,
            },
        });
    } catch (err) {
        console.log(err);
        return next(
            new AppError(
                'Something went wrong, Could not find Hotel reviews',
                500
            )
        );
    }
};
