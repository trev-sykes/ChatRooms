import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button/Button";
import { TextInput } from "./input/TextInput";
import { Modal } from "./modal/Modal";
import { ConversationItem } from "./coversation/ConversationItem";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { BackgroundOrbs } from "./BackgroundOrbs";

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
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/conversations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    // Add a small delay to ensure smooth animation
                    setTimeout(() => {
                        setConversations(data.conversations);
                    }, 300);
                }
            } catch (err) {
                console.error(err);
            } finally {
                // Keep loading state for a bit longer to allow for smooth transition
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        fetchConversations();
    }, [token]);

    const goToChat = (conversationId: number) =>
        navigate(`/conversation/${conversationId}`);

    const updateAvatar = async (customUrl?: string) => {
        if (!user) return;

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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <PageWrapper centered>
            <div className="relative w-full max-w-6xl px-6 flex flex-col items-center gap-10">
                <BackgroundOrbs variant="home" />
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
                                            <motion.img
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
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

                        {/* Conversations Card with fixed height during loading */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="lg:col-span-2 z-10"
                        >
                            <Card>
                                <CardHeader>Your Conversations</CardHeader>
                                <motion.div
                                    layout
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                >
                                    <CardContent>
                                        <div
                                            className={`transition-all duration-500 ease-in-out ${loading ? 'min-h-[200px]' : 'min-h-0'
                                                }`}
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex justify-center items-center py-12"
                                                    >
                                                        <div className="flex space-x-2">
                                                            <motion.span
                                                                className="w-3 h-3 bg-white rounded-full"
                                                                animate={{ y: [0, -8, 0] }}
                                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                            />
                                                            <motion.span
                                                                className="w-3 h-3 bg-white rounded-full"
                                                                animate={{ y: [0, -8, 0] }}
                                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                            />
                                                            <motion.span
                                                                className="w-3 h-3 bg-white rounded-full"
                                                                animate={{ y: [0, -8, 0] }}
                                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="conversations"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    >
                                                        <ul className="flex flex-col gap-3">
                                                            {conversations.map((convo, index) => (
                                                                <motion.li
                                                                    key={convo.id}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{
                                                                        delay: index * 0.1,
                                                                        duration: 0.4,
                                                                        ease: "easeOut"
                                                                    }}
                                                                >
                                                                    <ConversationItem
                                                                        name={convo.name}
                                                                        users={convo.users}
                                                                        messageCount={convo._count?.messages}
                                                                        onClick={() => goToChat(convo.id)}
                                                                    />
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </CardContent>
                                </motion.div>
                                <CardFooter>
                                    <AnimatePresence>
                                        {!loading && conversations.length === 0 && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: 0.3, duration: 0.4 }}
                                                className="text-gray-500"
                                            >
                                                No conversations yet
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
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
                            className="font-semibold text-white cursor-pointer hover:text-indigo-300 transition-colors duration-200"
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
                        onClick={() => updateAvatar()}
                    >
                        Generate Random
                    </Button>
                </Modal>
            </div>
        </PageWrapper>
    );
};