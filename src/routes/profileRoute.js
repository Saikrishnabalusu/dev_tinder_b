const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth.js");
const { User } = require("../models/userModel.js");
const validateProfileEdit = require("../utils/validateProfileEdit.js");
const bcrypt = require("bcrypt");



profileRouter.get("/profile", userAuth, (req, res, next) => {
    try {
        res.json({ message: "Profile fetched successfully", data: req.loginUser });


    } catch (error) {
        res.status(400).send("Error in getting Profile :" + error.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const { loginUser } = req;
        //sanitize the req.body data
        validateProfileEdit(req);

        Object.keys(req.body).forEach((key) => loginUser[key] = req.body[key]); // this updates the loginUser

        await loginUser.save();
        res.json({
            "message": "User Details updated successfully",
            "updatedUser": loginUser
        })
    } catch (err) {
        res.status(400).json({ message: "User Updation Failed!!", error: err.message });
    }

})

profileRouter.patch("/profile/updatePassword", async (req, res) => {
    try {
        const { email: receivedEmail, password: newPassword } = req.body;


        const user = await User.findOne({ email: receivedEmail.toLowerCase().trim() });
        if (!user) {
            throw new Error("User Not Found!!")
        }
        //hash the password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({
            "message": "user found as below",
            "user": user
        })

    } catch (err) {
        res.status(400).send("Password Updation failed" + err)
    }
})


module.exports = profileRouter;