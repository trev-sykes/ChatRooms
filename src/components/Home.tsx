import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useHomeWebSocket } from "../hooks/useHomeWebsocket";
import { useHomeData } from "../hooks/useHomeData";
import { useHeartbeat } from "../hooks/useHeartbeat";
import { useConversations } from "../context/ConversationContext";
import { useConversationSearch } from "../hooks/useConversationSearch";
import { NotificationTitle } from "./NotificationTitle";
import { ProfileCard } from "./home/ProfileCard";
import { ConversationsList } from "./home/ConversationsList";
import { Modal } from "./ui/Modal";
import { TextInput } from "./ui/TextInput";
import { Button } from "./ui/Button";
import { NewConversationModal } from "./modals/NewConversationModal";
import { EditProfileModal } from "./modals/EditProfileModal";
import { getAvatarUrl } from "../utils/avatars";
import { avatarOptions } from "../utils/avatarOptions";
import { PageWrapper } from "./layout/PageWrapper";
import { GoogleLogin } from "@react-oauth/google";
import { fetchCurrentUser, linkGoogleApi } from "../api/auth";
import { Loader } from "./ui/Loader";

export const Home = () => {
    useHeartbeat();
    const { setUser, user, token, logout, updateAvatar } = useUser();
    const navigate = useNavigate();
    useEffect(() => { console.log(user) }, [user])
    // Load data and connect to WebSocket
    const { conversations, setConversations, allUsers, loading } = useHomeData();
    useHomeWebSocket(setConversations);

    // Search functionality
    const [searchTerm, setSearchTerm] = useState("");
    const filteredConvos = useConversationSearch(conversations, searchTerm);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [isNewConvoOpen, setIsNewConvoOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");

    const [isLinkGoogleOpen, setIsLinkGoogleOpen] = useState(false);
    const [loadingLink, setLoadingLink] = useState(false);


    const { unread } = useConversations();

    const goToChat = (id: number) => navigate(`/conversation/${id}`);
    const handleSetPassword = async () => {
        if (!token) return; // <-- guard against null
        if (!newPassword || newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        try {
            setPasswordLoading(true);
            setPasswordError(null);

            await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: newPassword }),
            });

            // Optionally, fetch the user again to refresh state
            // ✅ Refetch user after password set
            const updatedUser = await fetchCurrentUser(token);
            setUser(updatedUser);

            setIsSetPasswordOpen(false);
            setNewPassword("");
        } catch (err: any) {
            setPasswordError(err.message || "Failed to set password");
        } finally {
            setPasswordLoading(false);
        }
    };
    useEffect(() => {
        if (user?.needsPassword) {
            setIsSetPasswordOpen(true);
        } else {
            setIsSetPasswordOpen(false);
        }
    }, [user]);
    useEffect(() => {
        if (user && user?.needsGoogleLink) setIsLinkGoogleOpen(true);
        else setIsLinkGoogleOpen(false);
    }, [user]);
    const handleLinkGoogle = async (credentialResponse: any) => {
        if (!token) return;
        try {
            setLoadingLink(true);
            const { credential } = credentialResponse;
            if (!credential) throw new Error("No credential from Google");

            await linkGoogleApi(token, credential);

            // Refresh user in context
            const updatedUser = await fetchCurrentUser(token);
            setUser(updatedUser);

            setIsLinkGoogleOpen(false);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoadingLink(false);
        }
    };



    if (!user) {
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
    }

    return (
        <PageWrapper>
            <NotificationTitle appName={`ChatRooms - ${user.username}`} />
            <div style={{ marginBottom: '16px' }} />
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <ProfileCard
                        user={user}
                        onUpdateAvatar={() => setIsModalOpen(true)}
                        onEditProfile={() => setIsEditProfileOpen(true)}
                        onLogout={logout}
                    />

                    {/* Conversations List */}
                    <ConversationsList
                        conversations={conversations}
                        filteredConversations={filteredConvos}
                        loading={loading}
                        searchTerm={searchTerm}
                        currentUserId={user.id}
                        unread={unread}
                        onSearchChange={setSearchTerm}
                        onNewConversation={() => setIsNewConvoOpen(true)}
                        onConversationClick={goToChat}
                    />
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
                                const randomAvatar = getAvatarUrl(undefined, option.name, user.username);
                                updateAvatar(randomAvatar, option.name);
                                setIsModalOpen(false);
                            }}
                            className="w-16 h-16 rounded-full overflow-hidden border-2 hover:border-indigo-500 transition-colors duration-200"
                        >
                            <img
                                src={option.preview || 'https://i.pravatar.cc/100?u=preview18'}
                                alt={option.name}
                                className="w-full h-full object-cover"
                            />
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
            <Modal
                isOpen={isSetPasswordOpen}
                onClose={() => setIsSetPasswordOpen(false)}
                title="Set a Password"
            >
                <p className="mb-2 text-gray-300">
                    To enable login with username/password, please set a password.
                </p>
                <TextInput
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mb-2"
                />
                {passwordError && <p className="text-red-400 text-sm mb-2">{passwordError}</p>}
                <Button
                    onClick={handleSetPassword}
                    variant="primary"
                    className="w-full"
                    disabled={passwordLoading}
                >
                    {passwordLoading ? "Saving..." : "Save Password"}
                </Button>
            </Modal>
            <Modal isOpen={user !== null && user.needsGoogleLink !== null && isLinkGoogleOpen} onClose={() => setIsLinkGoogleOpen(false)} title="Link Google Account">
                <p className="mb-2 text-gray-300">
                    To enable Google login, please link your Google account.
                </p>
                {!loadingLink ? (
                    <GoogleLogin
                        onSuccess={handleLinkGoogle}
                    />
                ) : (
                    <Loader />
                )}

            </Modal>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
            <div style={{ marginBottom: '16px' }} />
        </PageWrapper>
    );
};