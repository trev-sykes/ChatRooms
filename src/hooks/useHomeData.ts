import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useConversations } from "../context/ConversationContext";
import { fetchConversations as apiFetchConversations } from "../api/conversations";
import { fetchAllUsers } from "../api/users";
import type { Conversation } from "../types/conversation";

export const useHomeData = () => {
    const { user, token } = useUser();
    const { initializeUnread } = useConversations();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [allUsers, setAllUsers] = useState<{ id: number; username: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                // Load conversations and users in parallel
                const [convos, users] = await Promise.all([
                    apiFetchConversations(token),
                    fetchAllUsers(token)
                ]);

                // Initialize unread counts from server data
                initializeUnread(convos);
                setConversations(convos);

                // Filter out the current user
                setAllUsers(users.filter((u: any) => u.id !== user?.id));
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [token, user?.id]);

    return {
        conversations,
        setConversations,
        allUsers,
        loading
    };
};