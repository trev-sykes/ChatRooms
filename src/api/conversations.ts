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
    const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass auth token in header
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch messages");

    return data.messages;
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
