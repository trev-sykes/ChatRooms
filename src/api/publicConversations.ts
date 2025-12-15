const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type PublicConversation = {
    id: number;
    name: string | null;
    createdAt: string;
    views: number;
    createdBy: {
        id: number;
        username: string;
        profilePicture?: string | null;
    };
    _count: {
        messages: number;
        users: number;
    };
    messages: {
        text: string;
        createdAt: string;
        sender: { username: string };
    }[];
};

export const fetchPublicConversations = async (
    limit = 20,
    cursor?: number
): Promise<{
    conversations: PublicConversation[];
    nextCursor: number | null;
}> => {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    if (cursor) params.append("cursor", String(cursor));

    const res = await fetch(
        `${BASE_URL}/conversations/public?${params.toString()}`
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch public conversations");
    }

    return data;
};
