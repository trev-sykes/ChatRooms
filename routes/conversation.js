import { Router } from "express";
import * as conversationController from "../controllers/conversationController.js";
import authMiddleware from "./middleware/authMiddleware.js";
const conversationRoutes = new Router();
// Protected routes

// Get conversations
conversationRoutes.get("/", authMiddleware, conversationController.getConversations);

// Get messages from a specific conversation
conversationRoutes.get("/:id/messages", authMiddleware, conversationController.getMessagesFromConversation);

// routes/conversationRoutes.ts
conversationRoutes.get("/:id/users", authMiddleware, conversationController.getConversationUsers);

// Create a conversation
conversationRoutes.post("/", authMiddleware, conversationController.createConversation);

//  Add member route
conversationRoutes.post("/add-member", authMiddleware, conversationController.addMemberToConversation);

// Leave a conversation
conversationRoutes.post("/leave", authMiddleware, conversationController.leaveConversation);


export default conversationRoutes;






