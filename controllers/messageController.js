import { prisma } from "../prisma/prisma.js";

// Get messages from global chat
export const getGlobalMessages = async (req, res) => {
    // Default Global Chat Id
    const conversationId = 1;
    try {
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } }
            },
        });
        res.json({ messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error getting messages" });
    }
}

// Get messages by conversationId
export const getMessagesByConversationId = async (req, res) => {
    try {
        const conversationId = Number(req.params.conversaionId);
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } }
            },
        });
        res.json({ messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error grabbing message by ID" });
    }
}

export const sendMessage = async (req, res) => {
    const { text, conversationId } = req.body;
    try {
        const message = await prisma.message.create({
            data: {
                text,
                senderId: req.user.userId,
                conversationId: conversationId ? Number(conversationId) : 1, // Defaults to global(1) if no conversation id 
            },
            include: {
                sender:
                    { select: { id: true, username: true, profilePicture: true } },
            },
        })
        res.json({ message });
    } catch (error) {
        console.error(error.message);
        req.status(500).json({ error: "Error sending message" });
    }
}