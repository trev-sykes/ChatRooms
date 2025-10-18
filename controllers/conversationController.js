import { SYSTEM_ID } from "../systemId.js";
import { conversationService } from "../services/conversationService.js";
import { messageService } from "../services/messageService.js";

// Get all conversation for user
export const getConversations = async (req, res) => {
    const userId = req.user.userId;
    try {
        // Fetch all conversations the user is part of, plus the global chat
        const conversations = await conversationService.getConversationsForUser(userId);
        // Compute unread count for each conversation
        const formatted = await Promise.all(conversations.map(async (conversation) => {
            const unreadCount = await conversationService.getUnreadCount(userId, conversation.id);
            return conversationService.formatConversationWithUnread(conversation, unreadCount);
        }));
        res.json({ conversations: formatted });
    } catch (error) {
        console.error("❌ Error getting conversations:", error);
        res.status(500).json({ error: "Error getting conversations" });
    }
};

// controllers/conversationController.ts
export const getConversationUsers = async (req, res) => {
    const conversationId = Number(req.params.id);
    try {
        const users = await conversationService.getConversationUsers(conversationId);
        const formatted = conversationService.formatConversationUsers(users);
        res.json({ users: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching conversation users" });
    }
};

// Get messages for a convsersation
export const getMessagesFromConversation = async (req, res) => {
    try {
        const conversationId = Number(req.params.id);
        if (!conversationId) {
            return res.status(400).json({ error: "Invalid conversation id" });
        }
        const messages = await messageService.getMessagesForConversation(conversationId);
        res.json({ messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error getting messages from conversation" });
    }
}
// update Conversation name

// Update conversation name
export const updateConversationName = async (req, res) => {
    try {
        const { conversationId, newName } = req.body;
        const userId = req.user.userId;

        if (!conversationId || !newName) {
            return res.status(400).json({ error: "conversationId and newName are required" });
        }

        // Check if user is part of conversation and is OWNER or ADMIN
        const isAuthorized = await conversationService.isUserAuthorized(
            userId,
            conversationId,
            ["OWNER", "ADMIN"]
        );
        if (!isAuthorized) {
            return res.status(403).json({ error: "Not allowed to rename this conversation" });
        }

        const updated = await conversationService.updateConversationName(conversationId, newName);
        res.json({ message: "Conversation name updated", conversation: updated });
    } catch (error) {
        console.error("❌ Error updating conversation name:", error);
        res.status(500).json({ error: "Failed to update conversation name" });
    }
};

// Create a conversation
export const createConversation = async (req, res) => {
    const { name, userIds } = req.body;
    const currentUserId = req.user.userId;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "No users specified" });
    }

    try {
        // Check for existing 1-on-1 conversation
        if (userIds.length === 1) {
            const existing = await conversationService.findExistingOneOnOne(
                currentUserId,
                userIds[0]
            );
            if (existing) return res.json({ conversation: existing });
        }

        const otherUserIds = userIds.filter(id => id !== currentUserId);

        // Create new conversation
        const conversation = await conversationService.createConversation(
            name,
            currentUserId,
            otherUserIds
        );

        res.json({ conversation });
    } catch (error) {
        console.error("Create conversation error:", error);
        res.status(500).json({ error: "Error creating conversation" });
    }
};

/**
 * Add a member to a conversation
 * Only OWNER or ADMIN can do this
 */
export const addMemberToConversation = async (req, res) => {
    const { conversationId, userIdToAdd } = req.body;
    const currentUserId = req.user.userId;

    if (!conversationId || !userIdToAdd) {
        return res.status(400).json({ error: "conversationId and userIdToAdd are required" });
    }

    try {
        // ✅ Verify current user is in the conversation
        const isAuthorized = await conversationService.isUserAuthorized(
            currentUserId,
            conversationId,
            ["OWNER", "ADMIN"]
        );
        if (!isAuthorized) {
            return res.status(403).json({ error: "You are not allowed to add members" });
        }

        // ✅ Check if the user to add already exists in conversation
        const existing = await conversationService.getUserMembership(userIdToAdd, conversationId);
        if (existing) {
            return res.status(400).json({ error: "User already in conversation" });
        }

        // ✅ Add user as MEMBER
        const newMember = await conversationService.addMember(conversationId, userIdToAdd);

        // After successfully adding the user as a MEMBER
        await messageService.createSystemMessage(
            conversationId,
            `${newMember.user.username} joined the conversation.`,
            SYSTEM_ID
        );

        res.json({
            message: "User added successfully",
            member: newMember,
        });
    } catch (error) {
        console.error("❌ Error adding member:", error);
        res.status(500).json({ error: "Error adding member to conversation" });
    }
};

export const removeMemberFromConversation = async (req, res) => {
    const { conversationId, userIdToRemove } = req.body;
    const currentUserId = req.user.userId;

    if (!conversationId || !userIdToRemove) {
        return res.status(400).json({ error: "conversationId and userIdToRemove are required" });
    }

    try {
        // Check that current user is OWNER or ADMIN
        const isAuthorized = await conversationService.isUserAuthorized(
            currentUserId,
            conversationId,
            ["OWNER", "ADMIN"]
        );
        if (!isAuthorized) {
            return res.status(403).json({ error: "Not allowed to remove members" });
        }
        // Ensure the user is apart of the conversation
        const memberToRemove = await conversationService.getUserMembership(
            userIdToRemove,
            conversationId
        );
        if (!memberToRemove) {
            return res.status(404).json({ error: "User not in conversation" });
        }

        // Delete user from conversation
        await conversationService.removeMember(conversationId, userIdToRemove);

        // Create system message
        await messageService.createSystemMessage(
            conversationId,
            `${memberToRemove.user.username} was removed from the conversation.`,
            SYSTEM_ID
        );

        res.json({ message: "User removed", member: memberToRemove });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove user" });
    }
};
export const leaveConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { conversationId } = req.body;
        const id = Number(conversationId);

        if (!id) {
            return res.status(400).json({ message: "conversationId is required" });
        }

        if (id === 1) {
            return res.status(403).json({
                message: "You cannot leave the global conversation",
            });
        }

        // Find the user's membership and username
        const existing = await conversationService.getUserMembership(userId, id);

        if (!existing) {
            return res.status(404).json({ message: "You are not part of this conversation" });
        }

        // Remove the user from the conversation
        await conversationService.removeMember(id, userId);

        // Check if any users remain
        const remainingUsers = await conversationService.getRemainingUsers(id);

        if (remainingUsers.length === 0) {
            await conversationService.deleteConversation(id);
        }
        // Create a SYSTEM message saying they left
        await messageService.createSystemMessage(
            id,
            `${existing.user.username} left the conversation.`,
            SYSTEM_ID
        );

        return res.status(200).json({
            message: remainingUsers.length === 0
                ? "You have left and the conversation was deleted"
                : "You have left the conversation",
        });
    } catch (error) {
        console.error("❌ Error leaving conversation:", error);
        return res.status(500).json({ message: "Failed to leave conversation" });
    }
};
export const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    const currentUserId = req.user.userId;

    if (!conversationId) {
        return res.status(400).json({ error: "conversationId is required" });
    }

    try {
        // ✅ Check if the user is part of the conversation and authorized to delete
        const isAuthorized = await conversationService.isUserAuthorized(
            currentUserId,
            Number(conversationId),
            ["OWNER", "ADMIN"]
        );

        if (!isAuthorized) {
            return res.status(403).json({
                error: "You are not allowed to delete this conversation"
            });
        }

        // ✅ Delete the conversation
        await conversationService.deleteConversation(Number(conversationId));

        res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting conversation:", error);
        res.status(500).json({ error: "Error deleting conversation" });
    }
};

