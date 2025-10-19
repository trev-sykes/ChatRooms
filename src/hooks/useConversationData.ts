import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import {
    fetchMessages,
    fetchConversationName,
    fetchConversationUsers
} from "../api/conversations";
import type { Message } from "../types/message";
import type { ConversationUser } from "../types/conversationUser";

export const useConversationData = (conversationId: number) => {
    const { token, user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationName, setConversationName] = useState<string>("");
    const [participants, setParticipants] = useState<ConversationUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || !conversationId || !user) return;

        const loadConversation = async () => {
            try {
                setLoading(true);
                const [msgs, name, users] = await Promise.all([
                    fetchMessages(conversationId, token),
                    fetchConversationName(conversationId, token, user.id),
                    fetchConversationUsers(conversationId, token),
                ]);
                setMessages(msgs);
                setConversationName(name);
                setParticipants(users);
            } catch (err) {
                console.error("Error loading conversation:", err);
            } finally {
                setLoading(false);
            }
        };

        loadConversation();
    }, [token, conversationId, user?.id]);

    // Add a new message to the list
    const addMessage = (message: Message) => {
        setMessages(prev => {
            // Prevent duplicates
            const exists = prev.some(
                m =>
                    m.sender?.id === message.sender?.id &&
                    m.text === message.text &&
                    Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2000
            );
            return exists ? prev : [...prev, message];
        });
    };

    return {
        messages,
        conversationName,
        participants,
        loading,
        addMessage,
        setParticipants
    };
};