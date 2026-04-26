const mongoose = require("mongoose");
const { User } = require("./userModel");

const connectionSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true,

    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        lowercase: true,
        required: true,
        enum: ["interested", "ignored", "rejected", "accepted"]
    }
}, { timestamps: true })

const ConnectionModel = mongoose.model("Connection", connectionSchema);

module.exports = { ConnectionModel };