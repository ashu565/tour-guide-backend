const User = require('../Models/User');
const AppError = require('../utils/appError');
const helper = require('../Models/Helper');
const Hotel = require('../Models/Hotel');
const HotelManager = require('../Models/HotelManager')

exports.createHotel = async (req,res,next) => {
    try {
          if(req.user.role !== 'Hotel')
          {
              return next(new AppError('You do not have access to create Hotel', 500));
          }
          const {hotelName, price, imageCover, images, bed, bathroom, description, locations} = req.body;

          const hotel = await Hotel.create({
            hotelName,
            price,
            imageCover,
            images,
            bed,
            bathroom,
            description,
            locations
          })

          await HotelManager.findByIdAndUpdate(req.user.specifics,
          {
               $push: {hotel : hotel._id }
          },
          {
            new: true,
          },
        );

        res.status(201).json({
            status: 'success',
            message: 'Created Hotel Successfully',
            hotel
        });
    }
    catch (err) {
        console.log(err);
        return next(new AppError('Something went wrong, Could not Create Hotel', 500));
    }
}
