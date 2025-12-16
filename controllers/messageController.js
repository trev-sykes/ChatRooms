import { conversationService } from "../services/conversationService.js";
import { autoJoinPublicConversation } from "./conversationController.js";
import { messageService } from "../services/messageService.js";

/**
 * Fetch messages for the Global Chat (id = 1)
 */
export const getGlobalMessages = async (req, res) => {
    const conversationId = 1;
    try {

        const messages = await messageService.getMessagesForConversation(
            conversationId,
            req.user.userId
        );

        res.json({ messages });
    } catch (error) {
        console.error("❌ Error fetching global messages:", error);
        res.status(500).json({ error: "Error getting messages" });
    }
};
// Get public conversations, no token required
export const getPublicMessages = async (req, res) => {
    const conversationId = Number(req.params.conversationId);
    try {
        if (isNaN(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID" });
        }
        const messages = await messageService.getMessagesForPublicConversation(
            conversationId
        )
        res.json({ messages });

    } catch (error) {
        console.error("❌ Error fetching public messages:", error);
        res.status(500).json({ error: "Error getting messages" });
    }
}

/**
 * Fetch messages by conversation ID
 */
export const getMessagesByConversationId = async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);

        if (isNaN(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID" });
        }

        // ✅ Allow all users to access Global Chat (id = 1)
        if (conversationId !== 1) {
            const membership = await conversationService.getUserMembership(
                req.user.userId,
                conversationId
            );

            if (!membership) {
                return res.status(403).json({ error: "Access denied: not a member of this conversation" });
            }
        }
        // ✅ Increment conversation views
        await conversationService.updateConversation(conversationId, undefined, undefined, true);

        const messages = await messageService.getMessagesForConversation(
            conversationId,
            req.user.userId
        );

        res.json({ messages });
    } catch (error) {
        console.error("❌ Error fetching messages by ID:", error);
        res.status(500).json({ error: "Error grabbing messages by conversation ID" });
    }
};

/**
 * Send a message to a conversation
 */
export const sendMessage = async (req, res) => {
    const { text, conversationId } = req.body;
    const userId = req.user.userId;

    try {
        const convId = conversationId ? Number(conversationId) : 1;

        console.log("📩 Sending message:", { userId, convId, text });

        // Send message with auto-join logic
        const message = await messageService.sendMessageWithAutoJoin({
            conversationId: convId,
            senderId: userId,
            text
        });

        console.log("✅ Message created:", message);

        res.json({ message });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ error: "Error sending message", details: error.message });
    }
};

export const markMessagesAsRead = async (req, res) => {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);
    const confirm = req.body?.confirm === true;

    if (!confirm) {
        return res.status(400).json({ error: "Missing confirm flag in body. Send { confirm: true } to mark as read." });
    }

    try {

        const updated = await messageService.markMessagesAsRead(userId, conversationId);
        const unreadCount = await messageService.getUnreadCount(userId);

        res.json({ updatedCount: updated.count, unreadCount });
    } catch (error) {
        console.error("❌ Error marking messages as read:", error);
        res.status(500).json({ error: "Error marking messages as read" });
    }
};

/**
 * Fetch all message receipts in a conversation
 */
export const getConversationReceipts = async (req, res) => {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);

    try {
        // ✅ Ensure user is part of the conversation
        const membership = await conversationService.getUserMembership(userId, conversationId);

        if (!membership) {
            return res.status(403).json({ error: "Access denied: not a member of this conversation" });
        }


        // ✅ Fetch receipts for all messages in this conversation
        // ✅ Fetch receipts for all messages in this conversation
        const receipts = await messageService.getConversationReceipts(conversationId);

        res.json({ receipts });
    } catch (error) {
        console.error("❌ Error fetching conversation receipts:", error);
        res.status(500).json({ error: "Error fetching conversation receipts" });
    }
};
