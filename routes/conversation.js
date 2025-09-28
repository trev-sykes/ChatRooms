import { Router } from "express";
import * as conversationController from "../controllers/conversationController.js";
import authMiddleware from "./middleware/authMiddleware.js";
const conversationRoutes = new Router();
// Protected routes

// Get conversations
conversationRoutes.get("/", authMiddleware, conversationController.getConversations);

// Get messages from a specific conversation
conversationRoutes.get("/:id/messages", authMiddleware, conversationController.getMessagesFromConversation);

// Create a conversation
conversationRoutes.post("/", authMiddleware, conversationController.createConversation);

export default conversationRoutes;






