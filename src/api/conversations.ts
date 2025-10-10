import axios from "axios";

// Base URL for all API requests, loaded from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all messages for a specific conversation
 * @param conversationId - The ID of the conversation
 * @param token - User authentication token
 * @returns Array of messages in the conversation
 * @throws Error if the request fails
 */
export const fetchMessages = async (conversationId: number, token: string) => {
    const res = await fetch(`${BASE_URL}/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch messages");

    // Optionally map receipts directly into message objects
    return data.messages.map((msg: any) => ({
        ...msg,
        isRead: msg.receipts?.[0]?.isRead || false,
        readAt: msg.receipts?.[0]?.readAt || null,
    }));
};

/**
 * Fetch all conversations for the current user
 * @param token - User authentication token
 * @returns Array of conversations
 * @throws Error if request fails
 */
export const fetchConversations = async (token: string) => {
    const res = await fetch(`${BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch conversations");

    return data.conversations; // returns array of Conversation objects
};

/**
 * Fetch the name of a conversation
 * - If conversation has a custom name, returns that
 * - Otherwise, returns usernames of other participants
 * @param conversationId - The ID of the conversation
 * @param token - User authentication token
 * @param userId - Current user's ID (used to exclude self from names)
 * @returns The conversation name as a string
 */
export const fetchConversationName = async (
    conversationId: number,
    token: string,
    userId: number
) => {
    const res = await fetch(`${BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch conversation name");

    // Find the conversation by ID
    const conversation = data.conversations.find((conv: any) => conv.id === conversationId);

    if (!conversation) return "Conversation";

    // Return custom name or a list of usernames (excluding current user)
    return (
        conversation.name ||
        conversation.users
            .filter((u: any) => u.id !== userId)
            .map((u: any) => u.username)
            .join(", ") ||
        "Conversation"
    );
};
/**
 * Fetch all users in a conversation along with their roles
 * @param conversationId - Conversation ID
 * @param token - User authentication token
 * @returns Array of users with id, username, profilePicture, role
 */
export const fetchConversationUsers = async (conversationId: number, token: string,) => {
    const res = await axios.get(`${BASE_URL}/conversations/${conversationId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.users; // should return array of { id, username, profilePicture?, role }
};

/**
 * Send a new message to a conversation
 * @param conversationId - The ID of the conversation
 * @param token - User authentication token
 * @param text - Message text
 * @returns The newly created message object
 * @throws Error if the request fails
 */
export const sendMessage = async (conversationId: number, token: string, text: string) => {
    const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, conversationId }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send message");

    return data.message;
};

export const createConversation = async (
    token: string,
    userIds: number[],
    name?: string
) => {
    const res = await axios.post(
        `${BASE_URL}/conversations`,
        { userIds, name },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return res.data.conversation;
};

// Invite a member to an existing conversation (requires admin/owner)
export const addMemberToConversation = async (
    token: string,
    conversationId: number,
    userIdToAdd: number
) => {
    const res = await axios.post(
        `${BASE_URL}/conversations/add-member`,
        { conversationId, userIdToAdd },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return res.data.member;
};

/**
 * Invite multiple users to a conversation (admin/owner only)
 */
export const addUsersToConversation = async (
    conversationId: number,
    token: string,
    userIds: number[]
) => {
    const res = await axios.post(
        `${BASE_URL}/conversations/add-members`,
        { conversationId, userIds },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.members; // returns array of added users
};

/**
 * Remove a user from a conversation (admin/owner only)
 */
export const removeUserFromConversation = async (
    conversationId: number,
    token: string,
    userIdToRemove: number
) => {
    const res = await axios.post(
        `${BASE_URL}/conversations/remove-member`,
        { conversationId, userIdToRemove },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.member; // returns removed user
};

/**
 * Leave a conversation
 */
export const leaveConversation = async (conversationId: number, token: string) => {
    const res = await axios.post(
        `${BASE_URL}/conversations/leave`,
        { conversationId },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.message; // e.g., "Left conversation"
};

/**
 * Mark all messages in a conversation as read
 * @param conversationId - ID of the conversation
 * @param token - User auth token
 * @returns The count of updated messages
 */
export const markMessagesAsRead = async (conversationId: number, token: string) => {
    const res = await fetch(`${BASE_URL}/messages/${conversationId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to mark messages as read");

    return data; // { updatedCount, unreadCount? }
};

export const fetchMessageReceipts = async (conversationId: number, token: string) => {
    const res = await fetch(`${BASE_URL}/conversations/${conversationId}/receipts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch receipts");
    return data.receipts;
};

export const markMessageAsRead = async (messageId: number, token: string) => {
    const res = await fetch(`${BASE_URL}/messages/${messageId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to mark as read");
    return data.receipt;
};
