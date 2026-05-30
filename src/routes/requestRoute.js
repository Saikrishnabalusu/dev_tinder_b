const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { ConnectionModel } = require("../models/connectionModel")
const requestRoute = express.Router();
const { User } = require("../models/userModel"); ``

requestRoute.post("/review/:status/:toUserId", userAuth, async (req, res) => {
    try {
        //request can be either rejected / accepted 
        const loginUser = req.loginUser;
        const { status, toUserId } = req.params;
        const typeAccepted = ["accepted", "rejected"]
        if (!typeAccepted.includes(status)) { throw new Error("Invalid request Params") }
        // for accepted requests, update the status in DB

        //update in the connection model
        const connection = await ConnectionModel.findOneAndUpdate({ fromUserId: toUserId, toUserId: loginUser._id },
            { status },
            { returnDocument: "after" }
        );
        const safeDisplayInfo = await connection.populate({ path: "fromUserId", select: "firstName lastName" })
        res.json({
            message: `${safeDisplayInfo.fromUserId.firstName} is ${safeDisplayInfo.status}`,
            data: safeDisplayInfo
        })


    } catch (error) {
        res.status(500).send("Something went wrong in Review Request Router - " + error.message)
    }

})

requestRoute.get("/pendingRequests", userAuth, async (req, res) => {
    try {
        const loginUser = req.loginUser;
        const pendingRequests = await ConnectionModel.find({ toUserId: loginUser._id, status: "interested" });
        // console.log("pendingRequests...", pendingRequests)
        const pendingRequestsUserIds = pendingRequests.map(request => {
            if (request.fromUserId.toString() === loginUser._id.toString()) {
                return request.toUserId;
            }
            else {
                return request.fromUserId;
            }
        })
        // console.log("pendingRequestsUserIds...", pendingRequestsUserIds)
        const safeDisplayInfo = await User.find({ _id: { $in: pendingRequestsUserIds } }, "firstName lastName age gender skills profileUrl");
        res.json({
            message: "Pending Requests Fetched Successfully",
            data: safeDisplayInfo
        });

    } catch (error) {
        res.status(500).send("Something went wrong in Pending Requests Router - " + error.message)
    }
})

module.exports = { requestRoute }