import { prisma } from "../prisma/prisma.js";

/**
 * Fetch messages for the Global Chat (id = 1)
 */
export const getGlobalMessages = async (req, res) => {
    const conversationId = 1;
    try {
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } },
                receipts: { where: { userId: req.user.userId }, select: { isRead: false, readAt: true } }
            }
        });


        res.json({ messages });
    } catch (error) {
        console.error("❌ Error fetching global messages:", error);
        res.status(500).json({ error: "Error getting messages" });
    }
};

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
            const membership = await prisma.userConversation.findUnique({
                where: {
                    userId_conversationId: {
                        userId: req.user.userId,
                        conversationId
                    }
                }
            });

            if (!membership) {
                return res.status(403).json({ error: "Access denied: not a member of this conversation" });
            }
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } },
                receipts: { where: { userId: req.user.userId }, select: { isRead: true, readAt: true } }
            }
        });

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

        const conversation = await prisma.conversation.findUnique({
            where: { id: convId },
            include: { users: true } // get participants
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const membership = await prisma.userConversation.findUnique({
            where: { userId_conversationId: { userId, conversationId: convId } }
        });

        if (!membership && convId !== 1) return res.status(403).json({ error: "You are not part of this conversation" });

        // Create the message
        const message = await prisma.message.create({
            data: {
                text,
                senderId: userId,
                conversationId: convId,
            },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } }
            }
        });

        // ✅ Create receipts for all participants
        const participantIds = conversation.users?.map(u => u.userId);
        const receiptsData = participantIds.map(pid => ({
            messageId: message.id,
            userId: pid,
            isRead: pid === userId, // sender automatically reads their own message
            readAt: pid === userId ? new Date() : null,
        }));

        await prisma.messageReceipt.createMany({
            data: receiptsData
        });

        res.json({ message });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ error: "Error sending message" });
    }
};

export const markMessagesAsRead = async (req, res) => {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);
    const confirm = req.body?.confirm === true;

    console.log(`[markMessagesAsRead] user=${userId} conversation=${conversationId} confirm=${confirm} from ${req.ip}`);

    if (!confirm) {
        return res.status(400).json({ error: "Missing confirm flag in body. Send { confirm: true } to mark as read." });
    }

    try {
        const updated = await prisma.messageReceipt.updateMany({
            where: {
                userId,
                message: { conversationId },
                isRead: false
            },
            data: { isRead: true, readAt: new Date() }
        });

        const unreadCount = await prisma.messageReceipt.count({
            where: { userId, isRead: false }
        });

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
        const membership = await prisma.userConversation.findUnique({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({ error: "Access denied: not a member of this conversation" });
        }

        // ✅ Fetch receipts for all messages in this conversation
        const receipts = await prisma.messageReceipt.findMany({
            where: {
                message: { conversationId }
            },
            select: {
                messageId: true,
                userId: true,
                isRead: true,
                readAt: true
            }
        });

        res.json({ receipts });
    } catch (error) {
        console.error("❌ Error fetching conversation receipts:", error);
        res.status(500).json({ error: "Error fetching conversation receipts" });
    }
};
