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
                sender: {
                    select: { id: true, username: true, profilePicture: true }
                }
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

        // ✅ Check if user is part of the conversation
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

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: {
                    select: { id: true, username: true, profilePicture: true }
                }
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

        // ✅ Verify conversation exists
        const conversation = await prisma.conversation.findUnique({
            where: { id: convId },
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // ✅ Check if user is a member of this conversation
        const membership = await prisma.userConversation.findUnique({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: convId,
                }
            }
        });

        if (!membership && convId !== 1) {
            // allow sending to Global Chat (id = 1)
            return res.status(403).json({ error: "You are not part of this conversation" });
        }

        // ✅ Create message
        const message = await prisma.message.create({
            data: {
                text,
                senderId: userId,
                conversationId: convId,
            },
            include: {
                sender: {
                    select: { id: true, username: true, profilePicture: true }
                }
            }
        });

        res.json({ message });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ error: "Error sending message" });
    }
};
