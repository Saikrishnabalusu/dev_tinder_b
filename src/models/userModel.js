const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String,
        lowercase: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: "Invalid Email"
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,

    },
    skills: {
        type: [String]
    },
    profileUrl: {
        type: String
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    return token
}

userSchema.methods.comparePassword = async function (req) {
    const receivedPassword = req.body.password;
    const isPasswordMatched = await bcrypt.compare(receivedPassword, this.password);
    console.log(isPasswordMatched + "passwordValidation")
    return isPasswordMatched;
}

const User = mongoose.model("User", userSchema);

module.exports = { User };