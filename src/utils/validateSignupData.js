const validator = require("validator")
const validateSignupData = (req) => {
    const { firstName, lastName, email, password, age, gender } = req.body;
    if (!email || !password) {
        throw new Error("Required Fileds are missing");
    } else if (!["male", "female", "other"].includes(gender.toLowerCase())) {
        throw new Error("Invalid Gender specified!!")
    } else if (!validator.isEmail(email)) {
        throw new Error("Email validation failed!!")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password do not match the requiment standards")
    }
    console.log("signup data validated successfully!!");

}

module.exports = {
    validateSignupData
}