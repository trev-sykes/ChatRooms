import { WebSocketServer } from "ws";
import winston from "winston";
import { PresenceHandler } from "./presenceHandler.js";
import { MessageHandler } from "./messageHandler.js";
import { TypingHandler } from "./typingHandler.js";
import { ConversationHandler } from "./conversationHandler.js";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transports: [new winston.transports.Console()],
});

export function initializeWebSocket(server) {
    const wss = new WebSocketServer({ server });

    // Initialize handlers for different WebSocket events
    const presenceHandler = new PresenceHandler(wss);
    const messageHandler = new MessageHandler(wss);
    const typingHandler = new TypingHandler(wss);
    const conversationHandler = new ConversationHandler(wss);

    // Handle WebSocket connections
    wss.on("connection", (ws) => {
        logger.info("🟢 Client connected");
        let currentUserId = null;

        ws.on("message", async (data) => {
            try {
                const msg = JSON.parse(data);

                // Handle user joining the app or home screen
                if (msg.type === "join" || msg.type === "join_home") {
                    currentUserId = msg.userId;
                    presenceHandler.handleUserJoin(ws, currentUserId);
                }

                // Handle user joining a specific conversation
                if (msg.type === "join_conversation") {
                    currentUserId = msg.userId;
                    presenceHandler.handleUserJoin(ws, currentUserId);
                    await conversationHandler.handleJoinConversation(ws, msg);
                }

                // Handle incoming chat messages
                if (msg.type === "message") {
                    await messageHandler.handleMessage(ws, msg);
                }

                // Handle typing indicators
                if (msg.type === "typing") {
                    typingHandler.broadcastTyping(ws, msg);
                }
            } catch (err) {
                logger.error("Error handling WebSocket message:", err);
                ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
            }
        });

        ws.on("close", () => {
            logger.info("🔴 Client disconnected");

            // Clean up user presence when they disconnect
            if (currentUserId) {
                presenceHandler.handleUserDisconnect(currentUserId);
            }
        });

        ws.on("error", (error) => {
            logger.error("WebSocket error:", error);
        });
    });

    logger.info("✅ WebSocket server initialized");
    return wss;
}