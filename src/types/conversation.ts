export interface Conversation {
    id: number;
    name?: string | null;
    users: { id: number; username: string; profilePicture?: string }[];
    _count?: { messages: number };
    unreadCount?: number;
    lastMessage?: string;
    lastMessageAt?: string;
}