const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const validator = require('validator');
const bcryptjs = require("bcryptjs");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Traveller', 'Guide', 'Hotel', 'Admin'],
        default: 'Traveller',
        required: true
    },
    specifics: {
        type: ObjectId,
        refPath: "role"
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model("User", userSchema)
module.exports = User
