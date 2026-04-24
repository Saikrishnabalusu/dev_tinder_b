const mongoose = require("mongoose");

const connectionSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
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
        enum: ["interested", "ignored"]
    }
}, { timestamps: true })

const ConnectionModel = mongoose.model("Connection", connectionSchema);

module.exports = { ConnectionModel };