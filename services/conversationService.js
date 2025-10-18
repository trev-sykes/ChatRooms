import { prisma } from "../prisma/prisma.js";

export const conversationService = {

    async getConversationsForUser(userId) {
        return await prisma.conversation.findMany({
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
    },

    async getUnreadCount(userId, conversationId) {
        return await prisma.messageReceipt.count({
            where: {
                userId,
                isRead: false,
                message: { conversationId }
            }
        });
    },
    async getConversationUsers(conversationId) {
        return await prisma.userConversation.findMany({
            where: { conversationId },
            include: {
                user: { select: { id: true, username: true, profilePicture: true } }
            }
        });
    },
    async getConversationWithUsers(conversationId) {
        return await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { users: true }
        });
    },
    async getUserMembership(userId, conversationId) {
        return await prisma.userConversation.findUnique({
            where: { userId_conversationId: { userId, conversationId } },
            include: { user: true }
        });
    },
    async isUserAuthorized(userId, conversationId, allowedRoles = ["OWNER", "ADMIN"]) {
        const membership = await this.getUserMembership(userId, conversationId);
        return membership && allowedRoles.includes(membership.role);
    },
    async updateConversationName(conversationId, newName) {
        return await prisma.conversation.update({
            where: { id: conversationId },
            data: { name: newName, updatedAt: new Date() },
        });
    },
    async findExistingOneOnOne(currentUserId, otherUserId) {
        const existingConvos = await prisma.conversation.findMany({
            where: { users: { some: { userId: currentUserId } } },
            include: { users: true, _count: { select: { users: true } } }
        });

        return existingConvos.find(c =>
            c.users.some(u => u.userId === otherUserId) && c._count.users === 2
        );
    },
    async createConversation(name, creatorId, otherUserIds) {
        return await prisma.conversation.create({
            data: {
                ...(name ? { name } : {}),
                users: {
                    create: [
                        { user: { connect: { id: creatorId } }, role: "OWNER" },
                        ...otherUserIds.map(id => ({
                            user: { connect: { id } },
                            role: "MEMBER"
                        }))
                    ]
                }
            },
            include: { users: true }
        });
    },

    async addMember(conversationId, userId, role = "MEMBER") {
        const newMember = await prisma.userConversation.create({
            data: { userId, conversationId, role },
            include: {
                user: {
                    select: { id: true, username: true, profilePicture: true },
                },
            },
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return newMember;
    },

    async removeMember(conversationId, userId) {
        return await prisma.userConversation.delete({
            where: { userId_conversationId: { userId, conversationId } },
        });
    },

    async getRemainingUsers(conversationId) {
        return await prisma.userConversation.findMany({
            where: { conversationId },
        });
    },

    async deleteConversation(conversationId) {
        return await prisma.conversation.delete({
            where: { id: conversationId },
        });
    },
    async updateTimestamp(conversationId) {
        return await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
    },
    // Format users for response
    formatConversationUsers(users) {
        return users.map(uc => ({
            id: uc.user.id,
            username: uc.user.username,
            profilePicture: uc.user.profilePicture,
            role: uc.role
        }));
    },
    // In conversationService.js
    formatConversationWithUnread(conversation, unreadCount) {
        return {
            ...conversation,
            users: this.formatConversationUsers(conversation.users),
            unreadCount,
        };
    },
    async getUnreadRecipientIds(conversationId, senderId) {
        const users = await this.getConversationUsers(conversationId);
        return users
            .filter(uc => uc.userId !== senderId)
            .map(uc => uc.userId);
    }
};