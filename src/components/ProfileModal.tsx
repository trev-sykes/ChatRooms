import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/Card";

interface User {
    id: number;
    username: string;
    profilePicture?: string;
}

interface Conversation {
    id: number;
    users: { id: number; username: string }[];
}

export const ProfileModal: React.FC = () => {
    const { token } = useUser();
    const [selectedUser, setUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [text, setText] = useState("");
    const { userId } = useParams<{ userId: string }>();
    const numericUserId = Number(userId);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const resUser = await fetch(`http://localhost:4000/users/${numericUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataUser = await resUser.json();
                if (resUser.ok) setUser(dataUser.user);

                const resConvo = await fetch("http://localhost:4000/conversations", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataConvo = await resConvo.json();
                if (resConvo.ok) setConversations(dataConvo.conversations);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [token, numericUserId]);

    const existingConversation = conversations.find(
        (c) => c.users.some((u) => u.id === numericUserId)
    );

    const handleStartConversation = async () => {
        if (!token || !selectedUser) return;

        try {
            const res = await fetch("http://localhost:4000/conversations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userIds: [selectedUser.id], name: null }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to initiate conversation");

            const conversationId = data.conversation?.id;
            if (!conversationId) throw new Error("No conversation ID received");

            if (text.trim()) {
                await fetch("http://localhost:4000/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ text, conversationId }),
                });
            }

            navigate(`/conversation/${conversationId}`);
        } catch (err) {
            console.error(err);
            alert("Failed to initiate conversation");
        }
    };

    if (!selectedUser) return (
        <div className="text-gray-300 text-center mt-32 text-lg">
            Loading profile...
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl relative flex flex-col items-center gap-5 p-6">
                    {/* Close button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition text-lg font-semibold"
                    >
                        ✕
                    </button>

                    {/* Avatar */}
                    <motion.img
                        src={selectedUser.profilePicture || "https://placehold.co/120x120"}
                        alt={selectedUser.username}
                        className="w-32 h-32 rounded-full object-cover shadow-md"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Username */}
                    <h2 className="text-2xl font-bold text-white text-center">{selectedUser.username}</h2>

                    {/* Conditional: show input or Go to Chat button */}
                    <CardContent className="w-full flex flex-col gap-3">
                        {existingConversation ? (
                            <motion.button
                                onClick={() => navigate(`/conversation/${existingConversation.id}`)}
                                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md"
                            >
                                Go to Chat
                            </motion.button>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleStartConversation()}
                                    className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                                <motion.button
                                    onClick={handleStartConversation}
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md"
                                >
                                    Start Conversation
                                </motion.button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
