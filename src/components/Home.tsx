import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useHeartbeat } from "../hooks/useHeartbeat";
import { useConversations } from "../context/ConversationContext";
import { NotificationTitle } from "./NotificationTitle";
import { ProfileCard } from "./home/ProfileCard";
import { ConversationsList } from "./home/ConversationsList";
import { Modal } from "./ui/Modal";
import { TextInput } from "./ui/TextInput";
import { Button } from "./ui/Button";
import { NewConversationModal } from "./modals/NewConversationModal";
import { EditProfileModal } from "./modals/EditProfileModal";
import { PageWrapper } from "./layout/PageWrapper";
import { GoogleLogin } from "@react-oauth/google";
import { Loader } from "./ui/Loader";
import { AvatarModal } from "./modals/AvatarModal";
import { useHomeConversations } from "../hooks/useHomeConversation";
import { useAuthFlows } from "../hooks/useAuthFlows";

export const Home = () => {
    useHeartbeat();
    const { user, token, logout } = useUser();
    const navigate = useNavigate();
    const { unread } = useConversations();
    const {
        conversations,
        setConversations,
        allUsers,
        loading,
        searchTerm,
        setSearchTerm,
        filteredConvos
    } = useHomeConversations();
    const {
        isSetPasswordOpen,
        setIsSetPasswordOpen,
        newPassword,
        setNewPassword,
        passwordError,
        passwordLoading,
        handleSetPassword,
        isLinkGoogleOpen,
        setIsLinkGoogleOpen,
        loadingLink,
        handleLinkGoogle,
    } = useAuthFlows();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewConvoOpen, setIsNewConvoOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const goToChat = (id: number) => navigate(`/conversation/${id}`);

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
            <NotificationTitle appName={`${user.username}- Chatrooms`} />
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
            <AvatarModal
                isModalOpen={isModalOpen}
                onChange={setIsModalOpen}
            />

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
                <p className="mb-2 text-text-muted">
                    To enable login with username/password, please set a password.
                </p>
                <TextInput
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mb-2"
                />
                {passwordError && <p className="text-accent-red text-sm mb-2">{passwordError}</p>}
                <Button
                    onClick={handleSetPassword}
                    variant="primary"
                    className="w-full"
                    disabled={passwordLoading}
                >
                    {passwordLoading ? "Saving..." : "Save Password"}
                </Button>
            </Modal>
            <Modal isOpen={isLinkGoogleOpen} onClose={() => setIsLinkGoogleOpen(false)} title="Link Google Account">
                <p className="mb-2 text-text-muted">
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