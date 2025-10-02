const { Server, Socket } = require("socket.io");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

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
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = { id: decoded.id, email: decoded.email };
            console.log("Socket auth success:", socket.user.id);
            next();
        } catch (err) {
            console.log("Socket auth failed:", err.message);
            return next(new Error("Unauthorized"));
        }
    });

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

            const roomId = senderId < receiverId
                ? `room_${senderId}_${receiverId}`
                : `room_${receiverId}_${senderId}`;

            const msgData = { senderId, receiverId, message }
            io.to(roomId).emit("receive_message", msgData);
            try {
                await db.query("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
                    [senderId, receiverId, message ]
                );
            } catch (err) {
                console.error("DB save error:", err);

            }
            console.log(`User ${senderId} sent message to Room ${roomId}: ${message}`);
        });

    })
}
module.exports = { initSocket };
