import "./config.js";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws"; // 👈 import ws
import http from "http"; // 👈 needed for wrapping express
import { prisma } from "./prisma/prisma.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import conversationRoutes from "./routes/conversation.js";
import userRoutes from "./routes/user.js";
import healthRoutes from "./routes/health.js";
import winston from "winston";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transports: [new winston.transports.Console()],
});

// Create our server instance
const app = express();

// Define which ports can connect
app.use(cors({
    origin: [
        "https://chat-rooms-chi.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}));

// Auto parse json
app.use(express.json());

// Mount routes
app.use("/auth", authRoutes);
app.use("/", messageRoutes);
app.use("/conversations", conversationRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);

// Wrap app with HTTP server
const server = http.createServer(app);

// Create WebSocket server on top of the same HTTP server
const wss = new WebSocketServer({ server });

const onlineUsers = new Map();

// Handle WebSocket connections
wss.on("connection", (ws) => {
    logger.info("🟢 Client connected");
    let currentUserId = null; // track the user for this connection

    // Example: send a welcome message
    ws.send(JSON.stringify({ type: "system", message: "Welcome!" }));

    ws.on("message", async (data) => {
        const msg = JSON.parse(data);

        if (msg.type === "join") {
            currentUserId = msg.userId;
            onlineUsers.set(currentUserId, ws);

            // Send the new client the list of currently online users
            ws.send(JSON.stringify({
                type: "presence_init",
                users: Array.from(onlineUsers.keys()) // array of userIds
            }));

            // Broadcast to all other clients that this user is online
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({
                        type: "presence",
                        userId: currentUserId,
                        online: true
                    }));
                }
            });
        }


        if (msg.type === "message") {
            try {
                // 🧩 1. Store the message in your Postgres DB
                const savedMessage = await prisma.message.create({
                    data: {
                        text: msg.text,
                        senderId: msg.userId,
                        conversationId: msg.conversationId,
                        type: msg.messageType || "TEXT",
                    },
                    include: {
                        sender: true, // Include user info if you want to send back
                    },
                });

                // 🧩 2. Broadcast to all users in this conversation
                wss.clients.forEach(client => {
                    if (client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({
                            type: "chat",
                            message: {
                                id: savedMessage.id,
                                text: savedMessage.text,
                                type: savedMessage.type,
                                sender: {
                                    id: savedMessage.sender.id,
                                    username: savedMessage.sender.username,
                                    profilePicture: savedMessage.sender.profilePicture
                                },
                                conversationId: savedMessage.conversationId,
                                createdAt: savedMessage.createdAt,
                            }
                        }));

                    }
                });

            } catch (err) {
                logger.error("❌ Error saving message:", err);
                ws.send(JSON.stringify({ type: "error", message: "Failed to save message" }));
            }
        }
        if (msg.type === "typing") {
            // Broadcast typing to everyone else in the same conversation
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({
                        type: "typing",
                        userId: msg.userId,
                        username: msg.username,
                        conversationId: msg.conversationId
                    }));
                }
            });
        }
    });

    ws.on("close", () => {
        logger.info("🔴 Client disconnected");
        if (currentUserId) {
            onlineUsers.delete(currentUserId);

            // Broadcast to all clients that this user is offline
            wss.clients.forEach(client => {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({
                        type: "presence",
                        userId: currentUserId,
                        online: false
                    }));
                }
            });
        }
    });
});

// Listen for calls
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => logger.info(`🚀 Server + WS running on port ${PORT}!`));
