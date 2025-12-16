import { Router } from "express";
import * as messageController from "../controllers/messageController.js"
import authMiddleware from "./middleware/authMiddleware.js";

const messageRoutes = Router();


// Get Public Messages
messageRoutes.get("/messages/public/:conversationId", messageController.getPublicMessages);
// Get Global messages
messageRoutes.get("/messages", authMiddleware, messageController.getGlobalMessages);
// Get Messages by conversationId
messageRoutes.get("/messages/:conversationId", authMiddleware, messageController.getMessagesByConversationId);

// Send a message
messageRoutes.post("/messages", authMiddleware, messageController.sendMessage);

// Mark messages as read in a conversation
messageRoutes.post("/messages/:conversationId/read", authMiddleware, messageController.markMessagesAsRead);
// ✅ New route
messageRoutes.get("/messages/:conversationId/receipts", authMiddleware, messageController.getConversationReceipts);



export default messageRoutes;