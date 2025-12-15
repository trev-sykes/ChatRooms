import { useEffect, useState } from "react";
import { fetchPublicConversations } from "../api/publicConversations";
import type { PublicConversation } from "../api/publicConversations";

export const usePublicConversations = () => {
    const [conversations, setConversations] = useState<PublicConversation[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetchPublicConversations(20, nextCursor ?? undefined);
            setConversations(prev => [...prev, ...res.conversations]);
            setNextCursor(res.nextCursor);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMore();
    }, []);

    return {
        conversations,
        loadMore,
        hasMore: nextCursor !== null,
        loading,
        error,
    };
};
