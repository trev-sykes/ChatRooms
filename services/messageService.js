import { prisma } from "../prisma/prisma.js";
import { conversationService } from "./conversationService.js";

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
    async getMessagesForPublicConversation(conversationId) {
        return await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, profilePicture: true } }
            }
        })
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
    async sendMessageWithAutoJoin({ conversationId, senderId, text }) {

        // 1. Fetch conversation
        const conversation = await conversationService.getConversationById(conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }

        // 2. Auto-join public conversation if user is not a member
        let membership = await conversationService.getUserMembership(senderId, conversationId);

        if (!membership && conversation.isPublic) {
            membership = await conversationService.addMember(conversationId, senderId);

            // Create system message
            const sysMessage = await this.createSystemMessage(
                conversationId,
                `${membership.user.username} joined the conversation.`,
                SYSTEM_ID
            );
        }

        // 3. Get participant IDs
        const participants = await conversationService.getConversationUsers(conversationId);
        const participantIds = participants.map(u => u.userId);

        // 4. Create message with receipts
        const message = await this.createMessageWithReceipts(
            { text, senderId, conversationId },
            participantIds
        );

        return message;
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