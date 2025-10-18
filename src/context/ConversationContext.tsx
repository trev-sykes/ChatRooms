import React, { createContext, useContext, useState } from "react";

type UnreadMap = Record<number, number>;

interface ConversationContextType {
    unread: UnreadMap;
    setUnread: React.Dispatch<React.SetStateAction<UnreadMap>>;
    markAsRead: (conversationId: number) => void;
    incrementUnread: (conversationId: number) => void;
    initializeUnread: (conversations: { id: number; unreadCount: number }[]) => void;
}


const ConversationContext = createContext<ConversationContextType>({
    unread: {},
    setUnread: () => { },
    markAsRead: () => { },
    incrementUnread: () => { },
    initializeUnread: () => { }
});

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unread, setUnread] = useState<UnreadMap>({});

    const markAsRead = (conversationId: number) => {
        setUnread(prev => {
            const updated = { ...prev };
            delete updated[conversationId];
            return updated;
        });
    };
    const initializeUnread = (conversations: { id: number; unreadCount: number }[]) => {
        const initialUnread: UnreadMap = {};
        conversations.forEach(c => {
            if (c.unreadCount && c.unreadCount > 0) {
                initialUnread[c.id] = c.unreadCount;
            }
        });
        setUnread(initialUnread);
    };


    const incrementUnread = (conversationId: number) => {
        setUnread(prev => ({
            ...prev,
            [conversationId]: (prev[conversationId] || 0) + 1,
        }));
    };

    return (
        <ConversationContext.Provider value={{ unread, setUnread, markAsRead, incrementUnread, initializeUnread }}>
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversations = () => useContext(ConversationContext);
