import { Router } from "express";
import * as messageController from "../controllers/messageController.js"
import authMiddleware from "./middleware/authMiddleware.js";

const messageRoutes = new Router();

// Protected routes

// Get Global messages
messageRoutes.get("/messages", authMiddleware, messageController.getGlobalMessages);
// Get Messages by conversationId
messageRoutes.get("/messages/:conversationId", authMiddleware, messageController.getMessagesByConversationId);
// Send a message
messageRoutes.post("/messages", authMiddleware, messageController.sendMessage);

export default messageRoutes;