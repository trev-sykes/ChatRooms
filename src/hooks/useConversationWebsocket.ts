import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import type { Message } from "../types/message";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_URL = BASE_URL.replace(/^http/, "ws");

interface UseConversationWebSocketProps {
    conversationId: number;
    onNewMessage: (message: Message) => void;
}

export const useConversationWebSocket = ({
    conversationId,
    onNewMessage
}: UseConversationWebSocketProps) => {
    const { user } = useUser();
    const wsRef = useRef<WebSocket | null>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
    const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        if (!conversationId || !user) return;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join_conversation",
                userId: user.id,
                conversationId
            }));

            // Mark user as online
            ws.send(JSON.stringify({
                type: "presence",
                userId: user.id,
                online: true
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Handle incoming chat messages
            if (data.type === "chat") {
                // if (data.message.sender.id === user.id) return; // Skip own messages
                onNewMessage(data.message);
            }

            // Handle typing indicators
            if (data.type === "typing" && data.userId !== user.id) {
                setTypingUsers(prev => {
                    if (!prev.includes(data.username)) return [...prev, data.username];
                    return prev;
                });

                // Clear previous timeout for this user
                const prevTimeout = typingTimeouts.current.get(data.username);
                if (prevTimeout) clearTimeout(prevTimeout);

                // Set new timeout to remove typing indicator
                const timeout = setTimeout(() => {
                    setTypingUsers(prev => prev.filter(u => u !== data.username));
                    typingTimeouts.current.delete(data.username);
                }, 2000);

                typingTimeouts.current.set(data.username, timeout);
            }

            // Handle presence initialization
            if (data.type === "presence_init") {
                setOnlineUsers(new Set(data.users));
            }

            // Handle presence updates
            if (data.type === "presence") {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    if (data.online) newSet.add(data.userId);
                    else newSet.delete(data.userId);
                    return newSet;
                });
            }
        };

        ws.onclose = () => {
        };

        ws.onerror = (err) => {
            console.error("⚠️ Conversation WS Error", err);
        };

        return () => {
            // Clean up all typing timeouts
            typingTimeouts.current.forEach(timeout => clearTimeout(timeout));
            typingTimeouts.current.clear();

            ws.close(1000, "Component unmounting");
            wsRef.current = null;
        };
    }, [conversationId, user?.id]);

    // Send typing indicator
    const sendTyping = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN && user) {
            wsRef.current.send(JSON.stringify({
                type: "typing",
                userId: user.id,
                username: user.username,
                conversationId
            }));
        }
    };

    // Send message via WebSocket
    const sendMessage = (text: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && user) {
            wsRef.current.send(JSON.stringify({
                type: "message",
                text,
                userId: user.id,
                conversationId
            }));
        }
    };

    return {
        typingUsers,
        onlineUsers,
        sendTyping,
        sendMessage,
        isConnected: wsRef.current?.readyState === WebSocket.OPEN
    };
};