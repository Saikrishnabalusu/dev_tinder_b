const validator = require("validator");

const validateLoginData = (req) => {
    const { email, password } = req.body;
    const isEmailValid = validator.isEmail(email);


    if (!isEmailValid || !password) {
        throw new Error("Invalid login credentials!!")
    }
    console.log("Email & Password sanitization complete")

}

module.exports = {
    validateLoginData
}