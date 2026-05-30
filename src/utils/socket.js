const socket = require("socket.io")

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
        socket.on("send_message", ({ firstName, targetUserId, loginUserId, newMessage }) => {
            const roomId = [targetUserId, loginUserId].sort().join("_");
            // console.log(firstName + " :  " + newMessage)
            io.to(roomId).emit("message_Received", { firstName, newMessage })
        });
        socket.on("disconnect", () => { });
    });

}

module.exports = { initializeSocket }