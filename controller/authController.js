const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const Email = require('../utils/email');
const crypto = require('crypto');
const helper = require('../Models/Helper');

exports.signup = async (req, res, next) => {
    try {
        const { firstName, lastName, mobile, email, password, role } = req.body;

        const checkExistingUser = await User.findOne({ email });

        if (checkExistingUser) {
            return next(
                new AppError('User already exist for provided email', 500)
            );
        }
        const Model = helper.getModelOnName(role);
        const roleModel = await Model.create({});
        const user = await User.create({
            firstName,
            lastName,
            mobile,
            email,
            password,
            role,
            specifics: roleModel._id,
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
        return next(new AppError('Something went wrong, Sign up failed', 500));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Invalid Credentials', 401));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(
                new AppError('User does not exist, please Sign up ', 404)
            );
        }

        if (!(await user.correctPassword(password, user.password))) {
            return next(
                new AppError('Password not correct for provided email', 401)
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
        return next(new AppError('Something went wrong, Logging fail', 500));
    }
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        console.log('token header', req.headers);
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return next(new AppError('You are not logged in', 401));
        console.log('errrrrrrrrrrrrrr');

        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findOne({ _id: decoded.id });
        user.password = undefined;
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return next(
            new AppError('Something went wrong, you do not have access', 403)
        );
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new AppError('No such User exists', 404));
        }

        const resetToken = await user.createPasswordResetToken();

        const resetURL = `${process.env.FRONTEND_URL_DEV}/auth/resetPassword/${resetToken}`;
        const message = `Forgot your password ? submit a patch reqest with your new password click to ${resetURL}`;

        try {
            await new Email(user, resetURL).sendPasswordReset();
            res.status(200).json({
                status: 'success',
                message: 'Reset token sent, please check your email',
            });

            await user.save({ validateBeforeSave: false });
        } catch {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(
                new AppError('There was an error in sending a mail', 500)
            );
        }
    } catch {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) return next(new AppError('Token Expired', 401));

        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword)
            return next(new AppError('Password do not match'));

        user.password = password;
        user.confirmPassword = confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully',
        });
    } catch (err) {
        next(
            new AppError('Something went wrong, Could not reset password', 500)
        );
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (
            !(await user.correctPassword(
                user.password,
                req.body.currentPassword
            ))
        )
            return next(new AppError('Password do not match'), 400);

        const { newPassword, newConfirmPassword } = req.body;
        if (newPassword !== newConfirmPassword)
            return next(new AppError('Password do not match'), 400);

        user.password = newPassword;
        user.confirmPassword = newConfirmPassword;

        await user.save({ validateBeforeSave: false, new: true });

        user.password = undefined;
        user.confirmPassword = undefined;

        res.status(200).json({
            status: 'success',
            data: null,
        });
    } catch {
        next(err);
    }
};
