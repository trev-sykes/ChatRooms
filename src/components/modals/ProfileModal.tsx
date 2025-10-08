import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/Card";
import { PageWrapper } from "../layout/PageWrapper";
import { Button } from "../ui/Button";
import { formatLastSeen } from "../../utils/formatLastSeen";

interface User {
    id: number;
    username: string;
    profilePicture?: string;
    bio?: string;
    lastSeen?: string;
}

interface Conversation {
    id: number;
    users: { id: number; username: string }[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProfileModal: React.FC = () => {
    const { user, token } = useUser();
    const [selectedUser, setUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const { userId } = useParams<{ userId: string }>();
    const numericUserId = Number(userId);
    const navigate = useNavigate();
    const isOwnProfile = user?.id === selectedUser?.id;


    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const resUser = await fetch(`${BASE_URL}/users/${numericUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataUser = await resUser.json();
                if (resUser.ok) setUser(dataUser.user);

                const resConvo = await fetch(`${BASE_URL}/conversations`, {
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
        setSending(true);
        try {
            const res = await fetch(`${BASE_URL}/conversations`, {
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
                await fetch(`${BASE_URL}/messages`, {
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
        } finally {
            setSending(false);
        }
    };

    if (!selectedUser) return (
        <PageWrapper centered>
            <div className="text-gray-300 text-center mt-32 text-lg">
                Loading profile...
            </div>
        </PageWrapper>
    );

    const isOnline = selectedUser?.lastSeen
        ? new Date(selectedUser.lastSeen).getTime() > Date.now() - 60 * 1000
        : true; // if no lastSeen, consider online


    return (
        <PageWrapper centered>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Card className="backdrop-blur-xl relative flex flex-col items-center gap-5 p-6">
                    {/* Close button */}
                    <Button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition text-lg font-semibold"
                    >
                        ✕
                    </Button>

                    {/* Avatar */}
                    <motion.img
                        src={selectedUser.profilePicture || "https://placehold.co/120x120"}
                        alt={selectedUser.username}
                        className={`w-32 h-32 rounded-full object-cover shadow-md border-4 ${isOnline ? 'border-green-400' : 'border-gray-600'}`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Username */}
                    <h2 className="text-2xl font-bold text-white text-center">{selectedUser.username}</h2>

                    {/* Bio */}
                    {selectedUser.bio ? (
                        <p className="text-gray-300 text-center mt-2 text-sm">{selectedUser.bio}</p>
                    ) : isOwnProfile ? (
                        <p
                            className="text-indigo-400 text-center mt-2 text-sm cursor-pointer hover:text-indigo-300"
                            onClick={() => alert("Open edit profile modal here")}
                        >
                            No bio yet — add one!
                        </p>
                    ) : null}


                    {/* Last Seen / Online */}
                    <p className={`text-center text-xs mt-1 ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                        {isOnline ? "Online" : `Last seen: ${formatLastSeen(selectedUser.lastSeen)}`}
                    </p>


                    {/* Conditional: show input or Go to Chat button */}
                    <CardContent className="w-full flex flex-col gap-3 mt-3">
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
                                    disabled={sending}
                                />
                                <Button
                                    onClick={handleStartConversation}
                                    variant="primary"
                                    className="w-full sm:w-auto"
                                    loading={sending}
                                    loadingText="Sending..."
                                >
                                    Start Conversation
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </PageWrapper>
    );
};
