import { useMemo } from "react";
import { useDebounce } from "./useDebounce";
import type { Conversation } from "../types/conversation";

export const useConversationSearch = (
    conversations: Conversation[],
    searchTerm: string
) => {
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const filteredConversations = useMemo(() => {
        const search = debouncedSearchTerm.toLowerCase();

        return conversations.filter((c) => {
            const name = c.name?.toLowerCase() || "";
            const usernames = c.users
                .map((u) => u.username?.toLowerCase() || "")
                .join(" ");
            return name.includes(search) || usernames.includes(search);
        });
    }, [debouncedSearchTerm, conversations]);

    return filteredConversations;
};