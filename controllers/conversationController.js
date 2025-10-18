import { prisma } from "../prisma/prisma.js"
import { SYSTEM_ID } from "../systemId.js";

// Get all conversation for user
// Get all conversations for user (with unread count)
export const getConversations = async (req, res) => {
    const userId = req.user.userId;

    try {
        // Fetch all conversations the user is part of, plus the global chat
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { users: { some: { userId } } },
                    { id: 1 }, // include the global chat
                ],
            },
            include: {
                users: {
                    select: {
                        user: {
                            select: { id: true, username: true, profilePicture: true },
                        },
                        role: true,
                    },
                },
                _count: { select: { messages: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Compute unread count for each conversation
        const formatted = await Promise.all(conversations.map(async (conversation) => {
            const unreadCount = await prisma.messageReceipt.count({
                where: {
                    userId,
                    isRead: false,
                    message: { conversationId: conversation.id }
                }
            });

            return {
                ...conversation,
                users: conversation.users.map(uc => ({
                    id: uc.user.id,
                    username: uc.user.username,
                    profilePicture: uc.user.profilePicture,
                    role: uc.role,
                })),
                unreadCount,
            };
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
        const users = await prisma.userConversation.findMany({
            where: { conversationId },
            include: {
                user: { select: { id: true, username: true, profilePicture: true } }
            }
        });

        const formatted = users.map(uc => ({
            id: uc.user.id,
            username: uc.user.username,
            profilePicture: uc.user.profilePicture,
            role: uc.role
        }));

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
        const membership = await prisma.userConversation.findUnique({
            where: { userId_conversationId: { userId, conversationId } },
        });

        if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
            return res.status(403).json({ error: "Not allowed to rename this conversation" });
        }

        const updated = await prisma.conversation.update({
            where: { id: conversationId },
            data: { name: newName, updatedAt: new Date() },
        });

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
            const existingConvos = await prisma.conversation.findMany({
                where: { users: { some: { userId: currentUserId } } },
                include: { users: true, _count: { select: { users: true } } }
            });

            const existing = existingConvos.find(c =>
                c.users.some(u => u.userId === userIds[0]) && c._count.users === 2
            );

            if (existing) return res.json({ conversation: existing });
        }

        // Create new conversation
        const otherUserIds = userIds.filter(id => id !== currentUserId);

        const conversation = await prisma.conversation.create({
            data: {
                ...(name ? { name } : {}),
                users: {
                    create: [
                        // Creator as OWNER
                        { user: { connect: { id: currentUserId } }, role: "OWNER" },

                        // Other users as MEMBER
                        ...otherUserIds.map(id => ({ user: { connect: { id } }, role: "MEMBER" }))
                    ]
                }
            },
            include: { users: true }
        });



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
        const requesterMembership = await prisma.userConversation.findUnique({
            where: {
                userId_conversationId: { userId: currentUserId, conversationId },
            },
        });

        if (!requesterMembership) {
            return res.status(403).json({ error: "You are not a member of this conversation" });
        }

        // ✅ Only OWNER or ADMIN can add members
        if (!["OWNER", "ADMIN"].includes(requesterMembership.role)) {
            return res.status(403).json({ error: "You are not allowed to add members" });
        }

        // ✅ Check if the user to add already exists in conversation
        const existing = await prisma.userConversation.findUnique({
            where: {
                userId_conversationId: { userId: userIdToAdd, conversationId },
            },
        });
        if (existing) {
            return res.status(400).json({ error: "User already in conversation" });
        }

        // ✅ Add user as MEMBER
        const newMember = await prisma.userConversation.create({
            data: {
                userId: userIdToAdd,
                conversationId,
                role: "MEMBER",
            },
            include: {
                user: {
                    select: { id: true, username: true, profilePicture: true },
                },
            },
        });

        // ✅ Update updatedAt timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
        // After successfully adding the user as a MEMBER
        await prisma.message.create({
            data: {
                text: `${newMember.user.username} joined the conversation.`,
                type: "SYSTEM",
                senderId: SYSTEM_ID,
                conversationId: conversationId,
            },
        });

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
        const requesterMembership = await prisma.userConversation.findUnique({
            where: { userId_conversationId: { userId: currentUserId, conversationId } },
        });

        if (!requesterMembership || !["OWNER", "ADMIN"].includes(requesterMembership.role)) {
            return res.status(403).json({ error: "Not allowed to remove members" });
        }

        // Ensure user to remove exists
        const memberToRemove = await prisma.userConversation.findUnique({
            where: { userId_conversationId: { userId: userIdToRemove, conversationId } },
            include: { user: true },
        });

        if (!memberToRemove) {
            return res.status(404).json({ error: "User not in conversation" });
        }

        // Delete user from conversation
        await prisma.userConversation.delete({
            where: { userId_conversationId: { userId: userIdToRemove, conversationId } },
        });

        // Create system message
        await prisma.message.create({
            data: {
                text: `${memberToRemove.user.username} was removed from the conversation.`,
                type: "SYSTEM",
                senderId: SYSTEM_ID,
                conversationId,
            },
        });

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
        const existing = await prisma.userConversation.findUnique({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: id,
                },
            },
            include: { user: true },
        });

        if (!existing) {
            return res.status(404).json({ message: "You are not part of this conversation" });
        }

        // Remove the user from the conversation
        await prisma.userConversation.delete({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: id,
                },
            },
        });
        // Check if any users remain
        const remainingUsers = await prisma.userConversation.findMany({
            where: { conversationId: id },
        });

        if (remainingUsers.length === 0) {
            await prisma.conversation.delete({ where: { id } });
        }
        // Create a SYSTEM message saying they left
        await prisma.message.create({
            data: {
                text: `${existing.user.username} left the conversation.`,
                type: "SYSTEM",
                senderId: SYSTEM_ID,
                conversationId: id,
            },
        });
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
        // ✅ Check if the user is part of the conversation
        const membership = await prisma.userConversation.findUnique({
            where: {
                userId_conversationId: { userId: currentUserId, conversationId: Number(conversationId) },
            },
        });

        if (!membership) {
            return res.status(403).json({ error: "You are not a member of this conversation" });
        }

        // ✅ Only OWNER or ADMIN can delete
        if (!["OWNER", "ADMIN"].includes(membership.role)) {
            return res.status(403).json({ error: "You are not allowed to delete this conversation" });
        }

        // ✅ Delete the conversation
        await prisma.conversation.delete({
            where: { id: Number(conversationId) },
        });

        res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting conversation:", error);
        res.status(500).json({ error: "Error deleting conversation" });
    }
};

