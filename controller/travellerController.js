const User = require('../Models/User');
const AppError = require('../utils/appError');
const helper = require('../Models/Helper');
const Review = require('../Models/review')
const Booking = require('../Models/Booking')

exports.createHotelReview = async(req,res,next) => {
    try {
        if(req.user.role !== 'Traveller')
        {
            return next(new AppError("Only Traveller can give Reviews"));
        }

        const userBooking = await Booking.find({
          user: req.user._id,
          Hotel: req.params.id
        });
        console.log(userBooking);
        if(!userBooking.length)
        {
              return next(new AppError("Only People who have visited this hotel can give review"));
        }
        const {review, rating} = req.body;

        const reviews = await Review.create({
           review,
           rating,
           user: req.user._id,
           hotel: req.params.id
        })

        res.status(200).json({
          status: "Success",
          data : {
            reviews
          }
        });
    }
    catch (err) {
        console.log(err);
        return next(new AppError('Something went wrong, Could not Create Review', 500));
    }
}

const filterObj = (obj, ...allowedFields) => {
const newObj = {};
Object.keys(obj).forEach(el => {
  if (allowedFields.includes(el)) newObj[el] = obj[el];
});
return newObj;
};


exports.editHotelReview = async(req,res,next) => {
  try {
      if(req.user.role !== 'Traveller')
      {
          return next(new AppError("Only Traveller can give Reviews"));
      }
      const review = await Review.findById(req.params.id);
      if(req.user._id.toString() !== review.user.toString())
      {
        return next(new AppError("This review was not made by you"));
      }
      const filteredBody = filterObj(req.body, 'review', 'rating');
      const editReview = await Review.findByIdAndUpdate(req.params.id, filteredBody,  {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        status: "Success",
        data: {
          editReview
        }
      })
  }
  catch (err) {
      console.log(err);
      return next(new AppError('Something went wrong, Could not Edit Review', 500));
  }
}


exports.deleteHotelReview = async(req,res,next) => {
  try {
      if(req.user.role !== 'Traveller')
      {
          return next(new AppError("Only Traveller can give Reviews"));
      }
      const review = await Review.findById(req.params.id);
      if(req.user._id.toString() !== review.user.toString())
      {
        return next(new AppError("This review was not made by you"));
      }
      await Review.remove({_id: req.params.id});

      res.status(200).json({
        status: "Success",
        data: NULL
      })
  }
  catch (err) {
      console.log(err);
      return next(new AppError('Something went wrong, Could not Delete Review', 500));
  }
}


exports.getAllReviews = async(req,res,next) => {
  try {
     if(req.user.role !== 'Traveller')
     {
         return next(new AppError("Only Traveller can give Reviews"));
     }
     const review = await Review.find({
       user: req.user._id
     });

     res.status(200).json({
       status: "success",
       data: {
         review
       }
     });
  }
  catch (err) {
      console.log(err);
      return next(new AppError('Something went wrong, Could not retrieve all Reviews', 500));
  }
}

exports.getTravellerCurrentBooking = async(req,res,next) => {
  try {
      const user = await User.findById(req.params.id);
      const bookings = await Booking.find({"user": req.params.id, "endingDate": {"$gte" : new Date()}});
      res.status(200).json({
        status:"Success",
        data: bookings
      });

  } catch(err) {
    console.log(err);
    return next(new AppError('Something went wrong, Could not find Your Current Bookings', 500));
  }
}


exports.getTravellerPastBooking = async(req,res,next) => {
  try {
      const user = await User.findById(req.params.id);
      const bookings = await Booking.find({"user": req.params.id, "endingDate": {"$lt" : new Date()}});
      res.status(200).json({
        status:"Success",
        data: bookings
      });

  } catch(err) {
    console.log(err);
    return next(new AppError('Something went wrong, Could not find Your Past Bookings', 500));
  }
}
