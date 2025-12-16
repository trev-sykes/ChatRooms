import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import {
    fetchMessages,
    fetchPublicMessages,
    fetchConversationName,
    fetchConversationUsers
} from "../api/conversations";
import type { Message } from "../types/message";
import type { ConversationUser } from "../types/conversationUser";

export const useConversationData = (isPublic = false, conversationId: number) => {
    const { token, user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationName, setConversationName] = useState<string>("");
    const [participants, setParticipants] = useState<ConversationUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!conversationId) return;

        const loadConversation = async () => {
            try {
                setLoading(true);

                if (isPublic) {
                    // Public conversation: no token or user needed
                    const msgs = await fetchPublicMessages(conversationId);
                    setMessages(msgs);
                    setConversationName("Public Conversation");
                    setParticipants([]); // Optionally leave empty or fetch public participants if needed
                } else {
                    // Private conversation: need token and user
                    if (!token || !user) return;

                    const [msgs, name, users] = await Promise.all([
                        fetchMessages(conversationId, token),
                        fetchConversationName(conversationId, token, user.id),
                        fetchConversationUsers(conversationId, token),
                    ]);
                    setMessages(msgs);
                    setConversationName(name);
                    setParticipants(users);
                }
            } catch (err) {
                console.error("Error loading conversation:", err);
            } finally {
                setLoading(false);
            }
        };

        loadConversation();
    }, [isPublic, token, conversationId, user?.id]);

    const addMessage = (message: Message) => {
        setMessages(prev => {
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
