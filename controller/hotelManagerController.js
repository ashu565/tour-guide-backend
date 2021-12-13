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
            hotelManager: re.user.specifics,
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

const filterObj = (obj, ...allowedFields) => {
const newObj = {};
Object.keys(obj).forEach(el => {
  if (allowedFields.includes(el)) newObj[el] = obj[el];
});
return newObj;
};

exports.editHotel = async(req,res,nex) => {
  try {
      if(req.user.role !== 'Hotel')
      {
          return next(new AppError('You do not have access to edit Hotel', 500));
      }
      const hotel = await Hotel.findById(req.params.id);
      if(req.user.specifics.toString() !== hotel.hotelManager.toString())
      {
          return next(new AppError('This hotel doesnt belong to you', 500));
      }
      const filteredBody = filterObj(req.body, 'hotelName', 'price', 'imageCover', 'images', 'bed', 'bathroom', 'description', 'location');
      const editHotel = await Hotel.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
     status: 'success',
     data: {
      hotel: editHotel
     }
     });
  }
  catch (err) {
      console.log(err);
      return next(new AppError('Something went wrong, Could not Edit Hotel', 500));
  }
}


exports.deleteHotel = async(req,res,nex) => {
  try {
      if(req.user.role !== 'Hotel')
      {
          return next(new AppError('You do not have access to delete Hotel', 500));
      }
      const hotel = await Hotel.findById(req.params.id);
      if(req.user.specifics.toString() !== hotel.hotelManager.toString())
      {
          return next(new AppError('This hotel doesnt belong to you', 500));
      }
      await Hotel.remove({_id:req.params.id});

      res.status(200).json({
     status: 'success',
     data: null
     });
  }
  catch (err) {
      console.log(err);
      return next(new AppError('Something went wrong, Could not Delete Hotel', 500));
  }
}


exports.getAllHotels = async(req,res,next) => {
   try {
     if(req.user.role !== 'Hotel')
     {
         return next(new AppError('You do not have access to delete Hotel', 500));
     }

     const hotelManager = await HotelManager.findById(req.user.specifics);
     res.status(200).json({
     status: 'success',
     data: hotelManager.hotel
     });
   }
   catch (err) {
       console.log(err);
       return next(new AppError('Something went wrong, Could not Retrieve Hotels', 500));
   }
}
