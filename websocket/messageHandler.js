import winston from "winston";
import { messageService } from "../services/messageService.js";
import { conversationService } from "../services/conversationService.js";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transports: [new winston.transports.Console()],
});

export class MessageHandler {
    constructor(wss) {
        this.wss = wss;
    }

    async handleMessage(ws, msg) {
        try {

            // Save the message to the database
            const savedMessage = await messageService.createMessage({
                text: msg.text,
                senderId: msg.userId,
                conversationId: msg.conversationId,
                type: msg.messageType
            });

            // Get all recipients who should be notified (everyone except sender)
            const recipientIds = await conversationService.getUnreadRecipientIds(
                msg.conversationId,
                msg.userId
            );

            // Create unread receipts for all recipients
            await messageService.createMessageReceipts(savedMessage.id, recipientIds);

            // Broadcast the new message to all connected clients
            this.broadcastMessage(savedMessage);

            return savedMessage;

        } catch (err) {
            logger.error("❌ Error saving message:", err);
            ws.send(JSON.stringify({ type: "error", message: "Failed to save message" }));
            throw err;
        }
    }

    broadcastMessage(savedMessage) {
        this.wss.clients.forEach(client => {
            if (client.readyState === 1) { // 1 = WebSocket.OPEN
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
    }
}