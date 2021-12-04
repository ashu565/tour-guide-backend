const User = require("../Models/User");
const { getModelOnName } = require("../Models/Helper");
const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");
const { promisify } = require("util");
const Email = require("../utils/email");

const debug = (xx) => {
  console.log(xx)
}


exports.signup = async (req, res, next) => {
  try {
        const { firstName, lastName, contact, email, password, confirmPassword, role, description } = req.body;
        const Model = await getModelOnName(role);
        const finalModel=await Model.create({
          description
        });
        specifics = Model._id;
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        user.password = undefined;
        user.confirmPassword = undefined;
        res.status(201).json({
          status: "success",
          data: {
            user,
            token,
          },
        });
  }
  catch (err) {
          console.log(err);
          next(err);
  }
};


exports.login = async (req,res,next) => {
  try {

       const {email,password} = req.body;
       if(!email || !password) {
            return next(new AppError("Invalid Credentials"));
       }

       const user = await User.findOne({
           email: email
       }).select("+password");

       if(!user || !(await user.correctPassword(password,user.password))){
             return next(new AppError("Invalid Credentials"), 400);
       }

       const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
       user.password = undefined;
       user.passwordConfirm = undefined;

       res.status(200).json({
         status: "success",
         data: {
           user,
           token
         },
       });
  }
  catch (err) {
       console.log(err);
  }
};

exports.protect = async (req,res,next) => {
   try {
       const token = req.headers.authorization;
       if(!token)
       return next(new AppError("You are not logged in"), 400);

       const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

       const user = await User.findOne({_id: decoded.id});
       user.password=undefined;
       req.user=user;
       next();
   }
   catch (err) {
       next(err);
   }
};


exports.forgotPassword = async (req,res,next) =>{
  try {
      const {email} = req.body;
      const user = await User.findOne({
        email:email
      });
      if(!user)
       return next(new AppError("No such User exists"), 400);

       const resetToken = await user.createPasswordResetToken();

       const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;
       const message = `Forgot your password ? submit a patch reqest with your new password click to ${resetURL}`;

       try {
           await new Email(user,resetURL).sendPasswordReset();
           res.status(200).json({
             status:"success",
             message: "Token send to mail"
           });
            await user.save({ validateBeforeSave: false });
       }
       catch {
           user.passwordResetToken = undefined;
           user.passwordResetExpires = undefined;
           await user.save({ validateBeforeSave: false });
           return next(new AppError("There was an error in sending a mail"), 400);
       }
  }
  catch {
       next(err);
  }
};
