const { Server, Socket } = require("socket.io");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const msgModel = require("../models/msgModel");
const Model = new msgModel();
function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.headers.authorization;

        if (!token) {
            console.log("Socket auth failed: No token");
            return next(new Error("Unauthorized"));
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            socket.user = { id: decoded.id, email: decoded.email };
            console.log("Socket auth success:", socket.user.id);
            next();
        } catch (err) {
            console.log("Socket auth failed:", err.message);
            return next(new Error("Unauthorized"));
        }
    });
    // const onlineUser = 
    io.on("connection", (socket) => {
        console.log("A user connected", socket.user.id);
        socket.on("join_chat", ({ receiverId }) => {
            const userId = socket.user.id;
            const roomId = userId < receiverId
                ? `room_${userId}_${receiverId}`
                : `room_${receiverId}_${userId}`;

            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);

            socket.emit("joined_room", { roomId });
        });

        socket.on("send_message", async ({ receiverId, message }) => {
            const senderId = socket.user.id;
            console.log("Sender from token:", senderId, "Receiver from token:", receiverId);

            const roomId = senderId < receiverId
                ? `room_${senderId}_${receiverId}`
                : `room_${receiverId}_${senderId}`;

            try {
                const check = await Model.isblocked(senderId, receiverId)
                console.log(check);

                if (check.length > 0) {
                    console.log(`BLOCKED: User ${senderId} -> ${receiverId} | Message NOT sent`);
                    return socket.emit("error_message", { message: "You are blocked or have blocked this user." });
                }

                const msgData = { senderId, receiverId, message };
                io.to(roomId).emit("receive_message", msgData);

                await Model.insertInDB(senderId, receiverId, message)

                console.log(`User ${senderId} sent message to Room ${roomId}: ${message}`);

            } catch (err) {
                console.error("DB save error:", err);
            }
        });


    })
}
module.exports = { initSocket };
