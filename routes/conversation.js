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

// Update conversation name
conversationRoutes.put("/update-name", authMiddleware, conversationController.updateConversationName);

// Remove member route
conversationRoutes.post("/remove-member", authMiddleware, conversationController.removeMemberFromConversation);

// Leave a conversation
conversationRoutes.post("/leave", authMiddleware, conversationController.leaveConversation);

// Delete a conversation
conversationRoutes.delete('/:conversationId', authMiddleware, conversationController.deleteConversation);

export default conversationRoutes;






