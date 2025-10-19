import winston from "winston";
import { messageService } from "../services/messageService.js";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transports: [new winston.transports.Console()],
});

export class ConversationHandler {
    constructor(wss) {
        this.wss = wss;
    }

    async handleJoinConversation(ws, msg) {
        // Confirm to the user that they've joined the conversation
        ws.send(JSON.stringify({
            type: "joined_conversation",
            conversationId: msg.conversationId
        }));

        // Mark all messages in this conversation as read for this user
        try {
            await messageService.markMessagesAsRead(msg.userId, msg.conversationId);
        } catch (err) {
            logger.error("Error marking messages as read:", err);
            throw err;
        }
    }
}