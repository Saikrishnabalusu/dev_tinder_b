const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String,
        lowercase: true
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
        min: 18
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };