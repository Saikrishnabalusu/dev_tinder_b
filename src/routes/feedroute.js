const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { User } = require('../models/userModel');
const { ConnectionModel } = require('../models/connectionModel');
const feedRouter = express.Router();

feedRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loginUser = req.loginUser;
        //list all the users who are not his connections
        const connections = await ConnectionModel.find({ $or: [{ fromUserId: loginUser._id, status: "accepted" }, { toUserId: loginUser._id, status: "accepted" }] });
        const connectionIds = connections.map((connection) => {
            return (connection.fromUserId.equals(loginUser._id) ? connection.toUserId : connection.fromUserId)
        })
        // console.log("connectionIds", connectionIds);
        const intersetedConnections = await ConnectionModel.find({ fromUserId: loginUser._id, status: "interested" }).select("toUserId -_id")
        const intersetedUserIds = intersetedConnections.map((connection) => connection.toUserId)
        // console.log("intersetedUserIds", intersetedUserIds);
        const feedUsers = await User.find({ _id: { $nin: [...connectionIds, ...intersetedUserIds, loginUser._id] } }).select("-password -email")
        res.json({
            message: "successfully fetched all users",
            data: feedUsers
        })
    } catch (error) {
        res.status(500).send("something went wrong while fetching feed data -" + error.message)
    }
})

module.exports = { feedRouter }