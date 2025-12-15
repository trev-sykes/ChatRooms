import { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useConversations } from "../context/ConversationContext";
import type { Conversation } from "../types/conversation";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_URL = BASE_URL.replace(/^http/, "ws");

interface Message {
    sender: { id: number };
    conversationId: number;
    text: string;
    createdAt: string;
}

export const useHomeWebSocket = (
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
) => {
    const { user, token } = useUser();
    const { incrementUnread } = useConversations();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isConnectingRef = useRef(false);

    useEffect(() => {
        if (!token || !user) return;

        // Prevent multiple simultaneous connection attempts
        if (isConnectingRef.current) {
            return;
        }

        // Don't create new connection if already connected
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        const connectWebSocket = () => {
            // Prevent duplicate connection attempts
            if (isConnectingRef.current) return;

            isConnectingRef.current = true;

            try {
                const ws = new WebSocket(WS_URL);
                wsRef.current = ws;

                ws.onopen = () => {
                    isConnectingRef.current = false;

                    ws.send(JSON.stringify({
                        type: "join_home",
                        userId: user.id
                    }));
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    if (data.type === "chat") {
                        const message: Message = data.message;

                        // Ignore messages sent by yourself
                        if (message.sender.id === user.id) return;

                        incrementUnread(message.conversationId);

                        // Update last message locally
                        setConversations(prev =>
                            prev.map(convo =>
                                convo.id === message.conversationId
                                    ? {
                                        ...convo,
                                        lastMessage: message.text,
                                        lastMessageAt: message.createdAt,
                                    }
                                    : convo
                            )
                        );
                    }

                    if (data.type === "presence") {
                        // Handle presence updates if needed
                    }
                };

                ws.onclose = (event) => {
                    wsRef.current = null;
                    isConnectingRef.current = false;

                    // Only auto-reconnect if it wasn't a clean closure and user is still logged in
                    if (token && user && event.code !== 1000) {
                        reconnectTimeoutRef.current = setTimeout(() => {
                            connectWebSocket();
                        }, 3000);
                    }
                };

                ws.onerror = (err) => {
                    console.error("⚠️ WS Error", err);
                    isConnectingRef.current = false;
                    // Don't call ws.close() here - let onclose handle it
                };
            } catch (error) {
                console.error("❌ Failed to create WebSocket:", error);
                isConnectingRef.current = false;
            }
        };

        connectWebSocket();

        // Cleanup function
        return () => {

            // Clear reconnect timeout
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            // Close WebSocket with clean closure code
            if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
                wsRef.current.close(1000, "Component unmounting");
                wsRef.current = null;
            }

            isConnectingRef.current = false;
        };
    }, [token, user?.id]); // Stable dependencies

    return null;
};