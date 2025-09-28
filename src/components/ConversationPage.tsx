import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { PageWrapper } from "./layout/PageWrapper";
import { Button } from "./button/Button";
import { Card, CardContent, CardFooter } from "../components/ui/Card";

interface Message {
    id: number;
    text: string;
    sender: {
        id: number;
        username: string;
        profilePicture?: string;
    };
    createAt: string;
}

interface Conversation {
    id: number;
    name: string | null;
    users: { id: number; username: string; profilePicture?: string }[];
}

export const ConversationPage: React.FC = () => {
    const navigate = useNavigate();
    const { token, user } = useUser();
    const { conversationId } = useParams<{ conversationId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationName, setConversationName] = useState<string>("");

    const numericConversationId = Number(conversationId);

    const fetchMessages = async () => {
        if (!token || !numericConversationId) return;
        try {
            const res = await fetch(
                `http://localhost:4000/conversations/${numericConversationId}/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (res.ok) setMessages(data.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchConversationName = async () => {
        if (!token || !numericConversationId) return;
        try {
            const res = await fetch(`http://localhost:4000/conversations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                const conversation = data.conversations.find(
                    (conv: Conversation) => conv.id === numericConversationId
                );
                setConversationName(
                    conversation?.name ||
                    conversation.users
                        .filter((u: any) => u.id !== user?.id)
                        .map((u: any) => u.username)
                        .join(", ") || "Conversation"
                );
            } else {
                setConversationName("Conversation");
            }
        } catch (err) {
            console.error(err);
            setConversationName("Conversation");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !token || !numericConversationId) return;
        try {
            const res = await fetch("http://localhost:4000/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: newMessage, conversationId: numericConversationId }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, data.message]);
                setNewMessage("");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchConversationName();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [token, conversationId]);

    return (
        <PageWrapper centered bgColor="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex items-center h-12"
                >
                    {/* Back button */}
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        className="absolute left-0"
                    >
                        ←
                    </Button>

                    {/* Title centered */}
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white">
                        {conversationName}
                    </h2>
                </motion.div>

                {/* Messages Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="flex-1 overflow-y-auto max-h-[70vh] flex flex-col">
                        <CardContent className="flex flex-col gap-3 p-4 sm:p-6">
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex gap-3 items-start ${msg.sender.id === user?.id ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender.id !== user?.id && (
                                        <img
                                            src={msg.sender.profilePicture || "https://placehold.co/48x48"}
                                            alt={msg.sender.username}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer"
                                            onClick={() => navigate(`/user/${msg.sender.id}`)}
                                        />
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-2xl max-w-[70%] sm:max-w-[60%] ${msg.sender.id === user?.id
                                            ? "bg-indigo-600 text-white self-end"
                                            : "bg-white/20 text-white"
                                            }`}
                                    >
                                        <strong>{msg.sender.username}</strong>: {msg.text}
                                        <div className="text-xs text-gray-300 mt-1">{new Date(msg.createAt).toLocaleString()}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>

                        {/* Input Footer */}
                        <CardFooter className="flex gap-3 flex-col sm:flex-row w-full mt-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                            <Button onClick={handleSendMessage} variant="primary" className="w-full sm:w-auto">
                                Send
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </PageWrapper>
    );
};
