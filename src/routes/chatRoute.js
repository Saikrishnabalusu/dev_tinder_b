
const express = require("express")
const { userAuth } = require("../middlewares/userAuth")
const { ChatModel } = require("../models/chatModel")

const chatRoute = express.Router()

chatRoute.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const { targetUserId } = req.params
        const loginUser = req.loginUser
        let chat = await ChatModel.findOne({
            participants: { $all: [targetUserId, loginUser._id] }
        }).populate("messages.senderId", "firstName lastName profileUrl")
        if (!chat) {
            chat = new ChatModel({
                participants: [loginUser._id, targetUserId],
                messages: []
            })
            return res.json({
                message: "success",
                data: chat

            })
        }

        return res.json({
            message: "sucess",
            data: chat
        })
    } catch (error) {
        res.status(500).send("something went wrong in get chat route :" + error)
    }

})

module.exports = { chatRoute }