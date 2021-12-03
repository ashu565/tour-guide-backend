const User = require("../Models/User");
const { getModelOnName } = require("../Models/Helper");
const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");

const debug = (xx) => {
  console.log(xx)
}
exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, contact, email, password, confirmPassword, role, description } = req.body;
    const roleOfUser = await getModelOnName(role, description);
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
  } catch (err) {
    console.log(err);
    next(err);
  }
};
