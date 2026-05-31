const socket = require("socket.io");
const { ChatModel } = require("../models/chatModel");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ["GET", "POST"],
            credentials: true
        }
    }
    );
    io.on("connection", (socket) => {
        socket.on("join_chat", ({ firstName, targetUserId, loginUserId }) => {
            const roomId = [targetUserId, loginUserId].sort().join("_")
            // console.log(firstName + "Joined room :" + roomId)
            socket.join(roomId);
        });
        socket.on("send_message", async ({ firstName, targetUserId, loginUserId, profileUrl, newMessage }) => {
            try {
                const roomId = [targetUserId, loginUserId].sort().join("_");
                // console.log(firstName + " :  " + newMessage)
                //find if existing conversation 
                let chat = await ChatModel.findOne({
                    participants: { $all: [targetUserId, loginUserId] }
                })
                if (!chat) {
                    chat = await new ChatModel({
                        participants: [targetUserId, loginUserId],
                        messages: []
                    })
                    await chat.save()
                }
                chat.messages.push({ senderId: loginUserId, text: newMessage })
                await chat.save()
                io.to(roomId).emit("message_Received", { senderId: { _id: loginUserId, firstName, profileUrl }, newMessage })
            } catch (error) {
                console.error(error)
            }
        });
        socket.on("disconnect", () => { });
    });

}

module.exports = { initializeSocket }