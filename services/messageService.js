import { prisma } from "../prisma/prisma.js";

export const sendMessage = async (userId, text, conversationId = 1) => {
    const convId = Number(conversationId);

    const conversation = await prisma.conversation.findUnique({
        where: { id: convId },
        include: { users: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    const membership = await prisma.userConversation.findUnique({
        where: { userId_conversationId: { userId, conversationId: convId } },
    });

    if (!membership && convId !== 1)
        throw new Error("You are not part of this conversation");

    // Create the message
    const message = await prisma.message.create({
        data: {
            text,
            senderId: userId,
            conversationId: convId,
        },
        include: {
            sender: { select: { id: true, username: true, profilePicture: true } },
        },
    });

    // Create receipts
    const participantIds = conversation.users?.map((u) => u.userId);
    const receiptsData = participantIds.map((pid) => ({
        messageId: message.id,
        userId: pid,
        isRead: pid === userId,
        readAt: pid === userId ? new Date() : null,
    }));

    await prisma.messageReceipt.createMany({ data: receiptsData });

    return message;
};
