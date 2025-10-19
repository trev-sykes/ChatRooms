import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
    addUsersToConversation,
    removeUserFromConversation,
    leaveConversation,
    sendMessage as sendMessageAPI
} from "../api/conversations";
import type { ConversationUser } from "../types/conversationUser";

export const useConversationActions = (conversationId: number) => {
    const { token } = useUser();
    const navigate = useNavigate();
    const [sending, setSending] = useState(false);

    const handleAddUsers = async (
        userIds: number[],
        onSuccess: (users: ConversationUser[]) => void
    ) => {
        if (!userIds.length || !token) return;

        try {
            await addUsersToConversation(conversationId, token, userIds);
            const { fetchConversationUsers } = await import("../api/conversations");
            const users = await fetchConversationUsers(conversationId, token);
            onSuccess(users);
        } catch (err) {
            console.error("Error adding users:", err);
        }
    };

    const handleRemoveUser = async (
        userId: number,
        onSuccess: (userId: number) => void
    ) => {
        if (!token) return;

        try {
            await removeUserFromConversation(conversationId, token, userId);
            onSuccess(userId);
        } catch (err) {
            console.error("Error removing user:", err);
        }
    };

    const handleLeave = async () => {
        if (!token || conversationId === 1) return;
        try {
            await leaveConversation(conversationId, token);
            navigate("/home");
        } catch (err) {
            console.error("Error leaving conversation:", err);
        }
    };

    const handleSendMessage = async (
        text: string,
        sendViaWebSocket?: () => void
    ) => {
        if (!text.trim() || !token) return;

        setSending(true);
        try {
            if (sendViaWebSocket) {
                sendViaWebSocket();
            } else {
                // Fallback to HTTP
                await sendMessageAPI(conversationId, token, text);
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            alert("Message could not be sent.");
        } finally {
            setSending(false);
        }
    };

    return {
        sending,
        handleAddUsers,
        handleRemoveUser,
        handleLeave,
        handleSendMessage
    };
};