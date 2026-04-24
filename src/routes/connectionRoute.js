const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { User } = require("../models/userModel");
const { ConnectionModel } = require("../models/connectionModel")

const connectionRoute = express.Router();

connectionRoute.post("/connection/:status/:toUserId", userAuth, async (req, res) => {

    try {
        // get the login user details from req
        const loginUser = req.loginUser;
        const { status, toUserId } = req.params;
        const toUser = await User.findById(toUserId);

        const allowedStatus = ["interested", "ignored"]
        if (!allowedStatus.includes(status.trim().toLocaleLowerCase())) {
            throw new Error("Invalid requested status")
        }


        if (!toUser) {
            throw new Error("The requested user not found in the DB")
        }

        const existingConnection = await connectionModel.find(
            { $or: [{ fromUserId: loginUser._id, toUserId }, { fromUserId: toUserId, toUserId: loginUser._id }] });
        // if(existingConnection.status ==="ignored"){
        //     throw new Error("Status ")
        // }
        // check if either of them exists in connections collection both from & to 

        // if none exists register the document in db



        const document = new ConnectionModel({ fromUserId: loginUser._id, toUserId, status })

        await document.save();

        res.send(`Connection Request sent : ${status}`)

    } catch (err) {
        res.status(400).send("Something went wrong while posting connection, " + err)
    }

})

module.exports = { connectionRoute }