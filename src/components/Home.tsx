import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./button/Button";
import { TextInput } from "./input/TextInput";
import { Modal } from "./modal/Modal";
import { ConversationItem } from "./coversation/ConversationItem";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";

interface Conversation {
    id: number;
    name?: string | null;
    users: { id: number; username: string; profilePicture?: string }[];
    _count?: { messages: number };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Home: React.FC = () => {
    const { user, token, logout } = useUser();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchConversations = async () => {
            try {
                const res = await fetch(`${BASE_URL}/conversations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setConversations(data.conversations);
            } catch (err) {
                console.error(err);
            }
        };

        fetchConversations();
    }, [token]);

    const goToChat = (conversationId: number) =>
        navigate(`/conversation/${conversationId}`);
    const updateAvatar = async (customUrl?: string) => {
        if (!user) return;

        // If user didn't provide a custom URL, generate one
        const avatarToUse = customUrl || `https://i.pravatar.cc/100?u=${Math.random()}`;

        setAvatarUrl(avatarToUse);
        setIsModalOpen(false);

        try {
            await fetch(`${BASE_URL}/users/${user.id}/profile-picture`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ profilePicture: avatarToUse }),
            });

            // Optionally update local state
            // setUser(prev => ({ ...prev, profilePicture: avatarToUse }));
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <PageWrapper centered>
            <div className="relative w-full max-w-6xl px-6 flex flex-col items-center gap-10">
                {/* Background blobs */}
                {/* Background blobs */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: 360 }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                    className="absolute w-[25rem] h-[25rem] bg-indigo-500/20 rounded-full blur-3xl top-10 -left-32 z-0"
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: -360 }}
                    transition={{ delay: 0.5, duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                    className="absolute w-[20rem] h-[20rem] bg-purple-500/20 rounded-full blur-3xl bottom-10 -right-28 z-0"
                />
                {user ? (
                    <div className="w-full flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-10">
                        {/* User Card (sidebar on desktop) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="lg:col-span-1 z-10"
                        >
                            <Card>
                                <CardHeader>{user.username}</CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center gap-4">
                                        {user.profilePicture && (
                                            <img
                                                src={avatarUrl || user.profilePicture}
                                                alt={user.username}
                                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg"
                                            />
                                        )}
                                        <div className="flex flex-col sm:flex-row gap-4 z-10">
                                            <Button
                                                onClick={() => setIsModalOpen(true)}
                                                variant="primary"
                                            >
                                                Update Avatar
                                            </Button>
                                            <Button onClick={logout} variant="secondary">
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>Member since 2025</CardFooter>
                            </Card>
                        </motion.div>

                        {/* Conversations Card (main content) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="lg:col-span-2 z-10"
                        >
                            <Card>
                                <CardHeader>Your Conversations</CardHeader>
                                <CardContent>
                                    <ul className="flex flex-col gap-3">
                                        {conversations.map((convo) => (
                                            <ConversationItem
                                                key={convo.id}
                                                name={convo.name}
                                                users={convo.users}
                                                messageCount={convo._count?.messages}
                                                onClick={() => goToChat(convo.id)}
                                            />
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    {conversations.length === 0 && (
                                        <span className="text-gray-500">No conversations yet</span>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-lg sm:text-xl text-gray-300 text-center"
                    >
                        Please{" "}
                        <span
                            className="font-semibold text-white cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            log in
                        </span>{" "}
                        to view your conversations.
                    </motion.p>
                )}

                {/* Avatar Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Update Avatar"
                >
                    <TextInput
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="Avatar URL"
                    />
                    <Button
                        onClick={() => updateAvatar(avatarUrl)}
                        variant="primary"
                        className="w-full mt-2"
                    >
                        Update
                    </Button>
                    <p className="text-center">or</p>
                    <Button
                        onClick={() => updateAvatar()} // no argument → generates random
                    >
                        Generate Random
                    </Button>

                </Modal>
            </div>
        </PageWrapper>
    );
};
