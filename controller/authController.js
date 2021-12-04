const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const AppError = require('../utils/appError');
const { promisify } = require("util");
const Email = require("../utils/email");
const crypto = require("crypto");

exports.signup = async (req, res, next) => {
    try {
        const { firstName, lastName, mobile, email, password, role } = req.body;

        const checkExistingUser = await User.findOne({ email });

        if (checkExistingUser) {
            return next(
                new AppError('User already exist for provided email'),
                500
            );
        }

        const user = await User.create({
            firstName,
            lastName,
            mobile,
            email,
            password,
            role,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        user.password = undefined;

        res.status(201).json({
            status: 'success',
            message: 'Sign Up successful, Welcome',
            user,
            token,
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Something went wrong, Sign up failed'), 500);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Invalid Credentials'));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(
                new AppError('User does not exist, please Sign up '),
                400
            );
        }

        if (!(await user.correctPassword(password, user.password))) {
            return next(
                new AppError('Password not correct for provided email'),
                400
            );
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        user.password = undefined;

        res.status(200).json({
            status: 'success',
            message: 'Logged In Successfully',
            user,
            token,
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Something went wrong, Logging fail'), 500);
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

exports.resetPassword = async (req,res,next) => {
  try {
      const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
      });
      if(!user)
      return next(new AppError("Token Expired"),400);
      const {password, confirmPassword} = req.body;

      if(password !== confirmPassword)
        return next(new AppError("Password do not match"));

        user.password=password;
        user.confirmPassword=confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({
          status:"success"
        });
     }
     catch (err) {
       next(err);
     }
};

exports.updatePassword = async (req,res,next) => {
  try {
      const user = await User.findById(req.user._id).select("+password");
      if(! (await user.correctPassword(user.password,req.body.currentPassword)))
      return next(new AppError("Password do not match"),400);

      const {newPassword, newConfirmPassword} = req.body;
      if(newPassword !== newConfirmPassword)
      return next(new AppError("Password do not match"),400);

      user.password = newPassword;
      user.confirmPassword = newConfirmPassword;

      await user.save({validateBeforeSave: false, new: true});

      user.password = undefined;
      user.confirmPassword = undefined;

      res.status(200).json({
        status: "success",
        data: null
      });
  }
  catch {
       next(err);
  }
};
