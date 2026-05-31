const mongoose = require('mongoose');
const { User } = require('./userModel');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Types.ObjectId,
            ref: User
        }
    ],
    messages: [messageSchema]
})

const ChatModel = mongoose.model("chat", chatSchema)
module.exports = { ChatModel }