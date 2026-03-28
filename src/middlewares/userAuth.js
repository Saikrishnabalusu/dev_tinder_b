const jwt = require("jsonwebtoken")
const { User } = require("../models/userModel")

const userAuth = async (req, res, next) => {
    let { token } = req.cookies
    // console.log("cookies :", cookies)
    if (token) {
        const deCodedToken = await jwt.verify(token, "JWT_SECRET")
        const { _id } = deCodedToken;
        const loginUser = await User.findById(_id);
        if (!loginUser) {
            throw new Error("User Authenticated failed!!")
        }
        req.loginUser = loginUser;
        next();
    } else {
        res.status(401).send("Authentication denied try re-login!!");
    }
}

module.exports = {
    userAuth
}