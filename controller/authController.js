const User = require("../Models/User");
const Model = require("../Models/Helper");
const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");
exports.signup = async (req,res,next) =>{
  try {
    const {firstName, lastName, contact, email, password, confirmPassword, role, description} = req.body;
    if(password !== confirmPassword){
        return next(new AppError("Passwords do not match", 400));
    }

    const roleOfUser=Model.getModelOnName(role,description);
    specifics = roleOfUser._id;

    const user = await User.create({
        firstName,
        lastName,
        contact,
        email,
        password,
        confirmPassword,
        role,
        specifics
    });
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
    user.password = undefined;
    user.confirmPassword = undefined;

    res.status(201).json({
      status:"success",
      data: {
        user,
        token,
      },
    });
  } catch (err) {
      next(err);
    }
};
