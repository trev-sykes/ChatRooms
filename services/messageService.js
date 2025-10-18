import { prisma } from "../prisma/prisma.js";

export const messageService = {
    async createMessage(messageData) {
        const { text, senderId, conversationId, type = "TEXT" } = messageData;

        return await prisma.message.create({
            data: {
                text,
                senderId,
                conversationId,
                type,
            },
            include: {
                sender: {
                    select: { id: true, username: true, profilePicture: true }
                },
            },
        });
    },

    async markMessagesAsRead(userId, conversationId) {
        return await prisma.messageReceipt.updateMany({
            where: {
                userId,
                message: { conversationId },
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
    },

    async createMessageReceipts(messageId, userIds) {
        const receipts = userIds.map(userId => ({
            messageId,
            userId,
            isRead: false,
        }));

        if (receipts.length > 0) {
            return await prisma.messageReceipt.createMany({
                data: receipts
            });
        }
    },
    async getMessagesForConversation(conversationId, userId = null) {
        const include = {
            sender: { select: { id: true, username: true, profilePicture: true } }
        };

        // If userId is provided, include their receipts
        if (userId) {
            include.receipts = {
                where: { userId },
                select: { isRead: true, readAt: true }
            };
        }

        return await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include
        });
    },
    async getMessagesForConversation(conversationId) {
        return await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } }
            }
        });
    },

    async createSystemMessage(conversationId, text, senderId) {
        return await prisma.message.create({
            data: {
                text,
                type: "SYSTEM",
                senderId,
                conversationId,
            },
        });
    },
    async createMessageWithReceipts(messageData, participantIds) {
        const { text, senderId, conversationId } = messageData;

        // Create the message
        const message = await this.createMessage({
            text,
            senderId,
            conversationId
        });

        // Create receipts for all participants
        const receiptsData = participantIds.map(pid => ({
            messageId: message.id,
            userId: pid,
            isRead: pid === senderId, // sender automatically reads their own message
            readAt: pid === senderId ? new Date() : null,
        }));

        await prisma.messageReceipt.createMany({
            data: receiptsData
        });

        return message;
    },
    async getUnreadCount(userId) {
        return await prisma.messageReceipt.count({
            where: { userId, isRead: false }
        });
    },

    async getConversationReceipts(conversationId) {
        return await prisma.messageReceipt.findMany({
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
    }
};