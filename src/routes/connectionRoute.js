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

        // handle if there is no existing connection positive case
        if (existingConnection.length === 0) {
            // console.log("no existing connection");
            const newConnection = new ConnectionModel({
                fromUserId: loginUser._id,
                toUserId,
                status
            })


            await newConnection.save()
            return res.json({
                "status": "success",
                "message": "Request sent successfully!!"
            })
        }

        // Handling the case when there is already a connection exists between the users
        if (existingConnection[0]?.status === "rejected") {
            throw new Error("Failed to send the request or the requested user isn't interested!!  ")
        }
        else if (existingConnection[0]?.status === "interested" && status === "interested") {
            // BUG here same user sending interested would eventually connected even if other user haven't accepted connection
            const { fromUserId } = existingConnection[0];
            if (fromUserId.toString() === loginUser._id.toString()) {
                throw new Error("You have already sent an interest request to this user.");
            }
            existingConnection[0].status = "accepted";
            await existingConnection[0].save();
            return res.json({
                status: "success",
                message: "Connection accepted"
            })
        }
        else if (existingConnection[0].status === "ignored") {
            existingConnection[0].status = status;
            await existingConnection[0].save()
            return res.json({
                status: "success",
                message: "Connection updated"
            })
        }
        // check if either of them exists in connections collection both from & to 

        // if none exists register the document in db


        return res.json({
            status: "info",
            message: "No action needed"
        });


    } catch (err) {
        res.status(400).send("Something went wrong while posting connection, " + err)
    }

})


connectionRoute.get("/connections", userAuth, async (req, res) => {
    try {
        // find all the connections with status interested
        const loginUser = req.loginUser;
        const connections = await ConnectionModel.find({ $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }], status: "accepted" })

        const connections_ids = connections.map(connection => {
            const { fromUserId, toUserId } = connection;
            return fromUserId._id.toString() === loginUser._id.toString() ? toUserId : fromUserId;
        });

        const userConnections = await User.find({ _id: { $in: connections_ids } }).select("firstName lastName profileUrl age gender skills")

        res.json({
            message: "users Fetched successfully",
            data: userConnections
        })
    } catch (error) {
        res.status(500).send("something went wrong in Connections Route -" + error.message)
    }
})

module.exports = { connectionRoute }