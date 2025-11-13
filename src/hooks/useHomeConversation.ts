import { useState } from "react";
import { useHomeWebSocket } from "./useHomeWebsocket";
import { useConversationSearch } from "./useConversationSearch";
import { useHomeData } from "./useHomeData";

export const useHomeConversations = () => {
    const { conversations, setConversations, allUsers, loading } = useHomeData();
    useHomeWebSocket(setConversations);

    const [searchTerm, setSearchTerm] = useState("");
    const filteredConvos = useConversationSearch(conversations, searchTerm);

    return {
        conversations,
        setConversations,
        allUsers,
        loading,
        searchTerm,
        setSearchTerm,
        filteredConvos
    };
};
