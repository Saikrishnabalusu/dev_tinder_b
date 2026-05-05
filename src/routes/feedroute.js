const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { User } = require('../models/userModel');
const feedRouter = express.Router();

feedRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loginUser = req.loginUser;
        //list all the users who are not his connections
        const allUsers = await User.find({ _id: { $ne: loginUser._id } }).select("-password -email")
        res.json({
            message: "successfully fetched all users",
            data: allUsers
        })
    } catch (error) {
        res.status(500).send("something went wrong while fetching feed data -" + error.message)
    }
})

module.exports = { feedRouter }