import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import { fetchConversations as apiFetchConversations } from "../api/conversations";
import { fetchAllUsers } from "../api/users";
import { Loader } from "./ui/Loader";
import { Modal } from "./ui/Modal";
import { TextInput } from "./ui/TextInput";
import { Button } from "./ui/Button";
import { NewConversationModal } from "./modals/NewConversationModal";
import { getAvatarUrl } from "../utils/avatars";
import { avatarOptions } from "../utils/avatarOptions";
import { EditProfileModal } from "./modals/EditProfileModal";
import { useHeartbeat } from "../hooks/useHeartbeat";


interface Conversation {
    id: number;
    name?: string | null;
    users: { id: number; username: string; profilePicture?: string }[];
    _count?: { messages: number };
}

export const Home = () => {
    useHeartbeat()
    const { user, token, logout, updateAvatar } = useUser();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConvos, setFilteredConvos] = useState<Conversation[]>([]);
    const [allUsers, setAllUsers] = useState<{ id: number; username: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewConvoOpen, setIsNewConvoOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);


    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadConversations = async () => {
            setLoading(true);
            try {
                const convos = await apiFetchConversations(token);
                setConversations(convos);
                setFilteredConvos(convos);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            } finally {
                setLoading(false);
            }
        };

        const loadUsers = async () => {
            try {
                const users = await fetchAllUsers(token);
                setAllUsers(users.filter((u: any) => u.id !== user?.id));
            } catch (err) {
                console.error(err);
            }
        };
        console.log("User in profile page:", user);
        loadConversations();
        loadUsers();
    }, [token]);

    useEffect(() => {
        const search = searchTerm.toLowerCase();
        setFilteredConvos(
            conversations.filter((c) => {
                const name = c.name?.toLowerCase() || "";
                const usernames = c.users.map((u) => u.username.toLowerCase()).join(" ");
                return name.includes(search) || usernames.includes(search);
            })
        );
    }, [searchTerm, conversations]);

    const goToChat = (id: number) => navigate(`/conversation/${id}`);
    if (!user)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-300 text-xl">
                Please{" "}
                <span
                    className="mx-2 font-semibold text-indigo-400 cursor-pointer hover:text-indigo-300"
                    onClick={() => navigate("/login")}
                >
                    log in
                </span>
                to view your conversations.
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>

                            <div className="flex flex-col items-center gap-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl text-white font-bold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-white">
                                        {user.username}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Member since 2025
                                    </p>
                                    {/* Bio Section */}
                                    <div className="text-center mt-4">
                                        {user.bio ? (
                                            <p className="text-gray-300 text-sm">{user.bio}</p>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditProfileOpen(true)}
                                                className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
                                            >
                                                Add a bio
                                            </button>
                                        )}
                                    </div>

                                </div>

                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Update Avatar
                                    </button>
                                    <button
                                        onClick={() => setIsEditProfileOpen(true)}
                                        className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Edit Profile
                                    </button>

                                    <button
                                        onClick={() => setIsNewConvoOpen(true)}
                                        className="w-full px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} /> New Conversation
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Conversations Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                            {/* Header */}
                            <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">Conversations</h2>
                            </div>

                            {/* Search */}
                            <div className="px-6 py-3 border-b border-slate-700 bg-slate-800/50">
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-3 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Conversations list */}
                            <div className="flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <div className="p-6 text-center">
                                            <Loader />
                                        </div>
                                    ) : filteredConvos.length > 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="divide-y divide-slate-700"
                                        >
                                            {filteredConvos.map((convo, index) => (
                                                <motion.div
                                                    key={convo.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => goToChat(convo.id)}
                                                    className="px-6 py-4 hover:bg-slate-700/40 cursor-pointer transition-colors duration-150 group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                                {convo.name ||
                                                                    convo.users
                                                                        .map((u) => u.username)
                                                                        .join(", ")}
                                                            </h3>
                                                            <p className="text-sm text-gray-400 mt-1">
                                                                {convo._count?.messages || 0} messages
                                                            </p>
                                                        </div>
                                                        {/* Avatars (max 3 stacked) */}
                                                        <div className="flex -space-x-2 ml-4">
                                                            {convo.users.length > 0 ? (
                                                                convo.users.slice(0, 3).map((u, index) => (
                                                                    <motion.img
                                                                        key={u.id}
                                                                        src={
                                                                            u.profilePicture ||
                                                                            "https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg"
                                                                        }
                                                                        alt={u.username}
                                                                        className="w-9 h-9 rounded-full border-2 border-slate-800 object-cover"
                                                                        style={{ zIndex: convo.users.length - index }}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        transition={{ duration: 0.2 }}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <img
                                                                    src="https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg"
                                                                    alt="default"
                                                                    className="w-9 h-9 rounded-full object-cover"
                                                                />
                                                            )}
                                                            {convo.users.length > 3 && (
                                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-700 text-xs font-semibold border-2 border-slate-800 text-gray-200">
                                                                    +{convo.users.length - 3}
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="p-6 text-center text-gray-400">
                                            {searchTerm ? "No conversations found" : "No conversations yet"}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="border-t border-slate-700 px-6 py-3 bg-slate-800/50">
                                <p className="text-xs text-gray-500">
                                    {filteredConvos.length} of {conversations.length} conversations
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Avatar Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update Avatar"
            >
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
                            <img src={option.preview} alt={option.name} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
                <TextInput
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Custom Avatar URL"
                    className="mb-2"
                />
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

            {/* New Conversation Modal */}
            <NewConversationModal
                token={token!}
                isOpen={isNewConvoOpen}
                onClose={() => setIsNewConvoOpen(false)}
                onCreated={(conversation) =>
                    setConversations((prev) => [conversation, ...prev])
                }
                allUsers={allUsers}
            />
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />

        </div>
    );
};
