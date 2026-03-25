const validator = require("validator");

const validateLoginData = (req) => {
    const { email, password } = req.body;
    const isEmailValid = validator.isEmail(email);
    const isPasswordStrong = validator.isStrongPassword(password)

    if (!isEmailValid || !isPasswordStrong) {
        throw new Error("The credentials do not meet the required standard!!")
    }
    console.log("Email & Password Validation passed")

}

module.exports = {
    validateLoginData
}