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
        if (!allowedStatus.includes(status.trim().toLowerCase())) {
            throw new Error("Invalid requested status")
        }


        if (!toUser) {
            throw new Error("The requested user not found in the DB")
        }
        //handle status = interested
        const existingConnection = await ConnectionModel.find(

            { $or: [{ fromUserId: loginUser._id, toUserId }, { fromUserId: toUserId, toUserId: loginUser._id }] });

        // handle if there is no existing connection
        if (!existingConnection) {
            const newConnection = new ConnectionModel({
                fromUserId: loginUser,
                toUserId,
                status
            })


            await newConnection.save()
            res.json({
                "status": "success",
                "message": "Request sent successfully!!"
            })
        }


        if (existingConnection[0]?.status === "rejected") {
            throw new Error("Failed to send the request or the requested user isn't interested!!  ")
        }
        else if (existingConnection[0]?.status === "interested") {
            existingConnection[0].status = "accepted";
            await existingConnection[0].save();
        }
        // check if either of them exists in connections collection both from & to 

        // if none exists register the document in db



        const document = new ConnectionModel({ fromUserId: loginUser._id, toUserId, status })

        await document.save();

        res.send(`Connection Request sent : ${status}`)

    } catch (err) {
        res.status(400).send("Something went wrong while posting connection, " + err)
    }

})


connectionRoute.get("/connections", userAuth, async (req, res) => {
    try {
        // find all the connections with status interested
        const loginUser = req.loginUser;
        const connections = await ConnectionModel.find({ $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }], status: "accepted" }).populate({
            path: "fromUserId toUserId",
            select: "firstName lastName"
        })
        res.json({
            message: "users Fetched successfully",
            data: connections
        })
    } catch (error) {
        res.status(500).send("something went wrong in Connections Route -" + error.message)
    }
})

module.exports = { connectionRoute }