import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import type { Message } from "../types/message";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_URL = BASE_URL.replace(/^http/, "ws");

interface UseConversationWebSocketProps {
    conversationId: number;
    onNewMessage: (message: Message) => void;
    isPublic?: boolean; // optional flag for public conversations
}

export const useConversationWebSocket = ({
    conversationId,
    onNewMessage,
    isPublic = false
}: UseConversationWebSocketProps) => {
    const { user } = useUser();
    const wsRef = useRef<WebSocket | null>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
    const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        if (!conversationId) return;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join_conversation",
                conversationId,
                userId: user?.id || null,
                username: user?.username || "Guest"
            }));

            // Mark user as online if logged in
            if (!isPublic && user) {
                ws.send(JSON.stringify({
                    type: "presence",
                    userId: user.id,
                    online: true
                }));
            }
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "chat":
                    onNewMessage(data.message);
                    break;

                case "typing":
                    if (data.userId === user?.id) return; // ignore self
                    setTypingUsers(prev => prev.includes(data.username) ? prev : [...prev, data.username]);

                    // Clear previous timeout
                    const prevTimeout = typingTimeouts.current.get(data.username);
                    if (prevTimeout) clearTimeout(prevTimeout);

                    // Remove typing indicator after 2s
                    const timeout = setTimeout(() => {
                        setTypingUsers(prev => prev.filter(u => u !== data.username));
                        typingTimeouts.current.delete(data.username);
                    }, 2000);
                    typingTimeouts.current.set(data.username, timeout);
                    break;

                case "presence_init":
                    if (!isPublic) {
                        setOnlineUsers(new Set(data.users));
                    }
                    break;

                case "presence":
                    if (!isPublic) {
                        setOnlineUsers(prev => {
                            const newSet = new Set(prev);
                            if (data.online) newSet.add(data.userId);
                            else newSet.delete(data.userId);
                            return newSet;
                        });
                    }
                    break;
            }
        };

        ws.onerror = (err) => {
            console.error("⚠️ WebSocket Error:", err);
        };

        ws.onclose = () => {
            // optionally handle reconnection
        };

        return () => {
            // cleanup
            typingTimeouts.current.forEach(t => clearTimeout(t));
            typingTimeouts.current.clear();
            ws.close(1000, "Component unmounting");
            wsRef.current = null;
        };
    }, [conversationId, user?.id, user?.username, isPublic]);

    // Send typing indicator (only for logged-in users in private chats)
    const sendTyping = () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        if (!user && !isPublic) return;

        wsRef.current.send(JSON.stringify({
            type: "typing",
            conversationId,
            userId: user?.id || null,
            username: user?.username || "Guest"
        }));
    };

    // Send chat message
    const sendMessage = (text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({
            type: "message",
            text,
            conversationId,
            userId: user?.id || null,
            username: user?.username || "Guest"
        }));
    };

    return {
        typingUsers,
        onlineUsers,
        sendTyping,
        sendMessage,
        isConnected: wsRef.current?.readyState === WebSocket.OPEN
    };
};
