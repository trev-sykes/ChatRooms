import { prisma } from "../../prisma/prisma.js"

// Get all conversation for user
export const getConversations = async (req, res) => {
    const userId = req.user.userId;
    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { users: { some: { userId } } }, // Grab conversations the user is in
                    { id: 1 }, // Include the global chat
                ]
            },
            include: {
                users: {
                    select: {
                        user: {
                            select: { id: true, username: true, profilePicture: true },
                        }
                    }
                },
                _count: { select: { messages: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        // flatten users array: users.user -> users
        const formatted = conversations.map(conversation => ({
            ...conversation,
            users: conversation.users.map(uc => uc.user)
        }));
        res.json({ conversations: formatted });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error getting conversations" });
    }
}

// Get messages for a convsersation
export const getMessagesFromConversation = async (req, res) => {
    try {
        const conversationId = Number(req.params.id);
        if (!conversationId) res.status(500).json({ error: "Invalid conversation id" });

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } }
            }
        })
        res.json({ messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error getting messages from conversation" });
    }
}

// Create a conversation
export const createConversation = async (req, res) => {
    const { name, userIds } = req.body;
    const currentUserId = req.user.userId;
    if (!userIds || !Array.isArray(userIds) || userIds.length == 0) {
        res.status(400).json({ error: "No users specified" });
    }
    try {
        // 1. Check for existing 1 on 1 conversations 
        // 1. Check for existing 1-on-1 conversations 
        if (userIds.length === 1) {
            const existingConvos = await prisma.conversation.findMany({
                where: {
                    users: { some: { userId: currentUserId } }
                },
                include: { users: true, _count: { select: { users: true } } }
            });

            const existing = existingConvos.find(c =>
                c.users.some(u => u.userId === userIds[0]) && c._count.users === 2
            );

            if (existing) {
                return res.json({ conversation: existing }); // <— don’t forget return
            }
        }

        // 2. Create a conversation
        const conversation = await prisma.conversation.create({
            data: {
                name: name || null,
                users: {
                    create: [
                        { user: { connect: { id: currentUserId } } },
                        ...userIds.map(id => ({ user: { connect: { id } } }))
                    ]
                }
            },
            include: { users: true }
        })
        res.json({ conversation })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error creating conversation" });
    }
}