import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { TextInput } from "./ui/TextInput";
import { Modal } from "./ui/Modal";
import { ConversationItem } from "./coversation/ConversationItem";
import { PageWrapper } from "./layout/PageWrapper";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { BackgroundOrbs } from "./ui/BackgroundOrbs";
import { fetchConversations as apiFetchConversations } from "../api/conversations";
import { avatarOptions } from "../utils/avatarOptions";
import { Loader } from "./Loader";
import { getAvatarUrl } from "../utils/avatars";

interface Conversation {
    id: number;
    name?: string | null;
    users: { id: number; username: string; profilePicture?: string }[];
    _count?: { messages: number };
}

export const Home: React.FC = () => {
    const { user, token, logout, updateAvatar } = useUser();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // Fetch conversations
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadConversations = async () => {
            setLoading(true);
            try {
                const convos = await apiFetchConversations(token);
                setTimeout(() => setConversations(convos), 300);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        loadConversations();
    }, [token]);

    const goToChat = (conversationId: number) => navigate(`/conversation/${conversationId}`);

    return (
        <PageWrapper centered>
            <div className="relative w-full max-w-6xl px-6 flex flex-col items-center gap-10">
                <BackgroundOrbs variant="home" />

                {user ? (
                    <div className="w-full flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-10">
                        {/* User Info Card */}
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
                                        {user.profilePicture ? (
                                            <motion.img
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg"
                                            />
                                        ) : (
                                            <Loader />
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

                        {/* Conversations List */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="lg:col-span-2 z-10"
                        >
                            <Card>
                                <CardHeader>Your Conversations</CardHeader>
                                <motion.div layout transition={{ duration: 0.6, ease: "easeInOut" }}>
                                    <CardContent>
                                        <div className={`transition-all duration-500 ease-in-out ${loading ? 'min-h-[200px]' : 'min-h-0'}`}>
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <Loader />
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
                                                                    transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
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

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Random Avatar">
                    {/* Random avatar options */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        {avatarOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => {
                                    const randomAvatar = getAvatarUrl(undefined, option.name);
                                    updateAvatar(randomAvatar, option.name);
                                    setIsModalOpen(false);
                                }}
                                className="w-16 h-16 rounded-full overflow-hidden border-2 hover:border-indigo-500 transition-colors duration-200"
                            >
                                <img
                                    src={option.preview}
                                    alt={option.name}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Optional custom URL input */}
                    <TextInput
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="Custom Avatar URL"
                        className="mb-2"
                    />

                    {/* Update button for custom URL */}
                    <Button
                        onClick={() => {
                            updateAvatar(avatarUrl);
                            setIsModalOpen(false);
                        }}
                        variant="primary"
                        className="w-full"
                    >
                        Update
                    </Button>
                </Modal>

            </div>
        </PageWrapper>
    );
};
