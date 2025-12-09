import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { PageWrapper } from "./layout/PageWrapper";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter } from "./ui/Card";
import { TextInput } from "./ui/TextInput";
import { AdminModal } from "./modals/AdminModal";
import { AddUsersModal } from "./modals/AddUsersModal";
import { LeaveConversationModal } from "./modals/LeaveConversationModal";
import { useConversationWebSocket } from "../hooks/useConversationWebsocket";
import { useConversationData } from "../hooks/useConversationData";
import { useConversationActions } from "../hooks/useConversationActions";
import type { ConversationUser } from "../types/conversationUser";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Conversation: React.FC = () => {
    const navigate = useNavigate();
    const { user, token } = useUser();
    const { conversationId } = useParams<{ conversationId: string }>();
    const numericConversationId = Number(conversationId);

    // Load conversation data
    const {
        messages,
        conversationName,
        participants,
        loading,
        addMessage,
        setParticipants
    } = useConversationData(numericConversationId);

    // WebSocket connection
    const {
        typingUsers,
        onlineUsers,
        sendTyping,
        sendMessage: sendViaWebSocket,
        isConnected
    } = useConversationWebSocket({
        conversationId: numericConversationId,
        onNewMessage: addMessage
    });

    // Conversation actions
    const {
        sending,
        handleAddUsers: addUsers,
        handleRemoveUser: removeUser,
        handleLeave,
        handleSendMessage: sendMessageAction
    } = useConversationActions(numericConversationId);

    // Local state
    const [newMessage, setNewMessage] = useState("");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [allUsers, setAllUsers] = useState<ConversationUser[]>([]);

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // Fetch available users when admin modal opens
    useEffect(() => {
        if (!isAdminModalOpen) return;

        const fetchAvailableUsers = async () => {
            try {
                const res = await fetch(`${BASE_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    const participantIds = new Set(participants.map(p => p.id));
                    const availableUsers = data.users.filter(
                        (u: ConversationUser) => !participantIds.has(u.id)
                    );
                    setAllUsers(availableUsers);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchAvailableUsers();
    }, [isAdminModalOpen, participants, token]);

    // Handle typing with WebSocket
    const handleTyping = (text: string) => {
        setNewMessage(text);
        sendTyping();
    };

    // Handle sending message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageText = newMessage;
        setNewMessage(""); // Clear input immediately

        await sendMessageAction(messageText, () => {
            if (isConnected) {
                sendViaWebSocket(messageText);
            }
        });
    };

    // Handle adding users
    const handleAddUsers = async () => {
        await addUsers(selectedUsers, (users) => {
            setParticipants(users);
            setIsAddUserModalOpen(false);
            setSelectedUsers([]);
        });
    };

    // Handle removing user
    const handleRemoveUser = async (userId: number) => {
        await removeUser(userId, (removedUserId) => {
            setParticipants(prev => prev.filter(p => p.id !== removedUserId));
        });
    };

    // Permission checks
    const currentUserParticipant = participants.find(p => p.id === user?.id);
    const isAdmin = currentUserParticipant?.role === "ADMIN" || currentUserParticipant?.role === "OWNER";
    const isOwner = currentUserParticipant?.role === "OWNER";

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-300 text-xl">
                Please log in to view this conversation.
            </div>
        );
    }

    return (
        <PageWrapper centered>
            {/* Modals */}
            {isAdmin && (
                <AdminModal
                    token={token}
                    isOpen={isAdminModalOpen}
                    onClose={() => setIsAdminModalOpen(false)}
                    participants={participants}
                    currentUserId={user.id}
                    isOwner={isOwner}
                    conversationId={numericConversationId}
                    conversationName={conversationName}
                    onRemoveUser={handleRemoveUser}
                    onInviteClick={() => setIsAddUserModalOpen(true)}
                    onLeave={handleLeave}
                />
            )}

            <AddUsersModal
                isOpen={isAddUserModalOpen}
                onClose={() => {
                    setIsAddUserModalOpen(false);
                    setSelectedUsers([]);
                }}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={setSelectedUsers}
                onAdd={handleAddUsers}
                availableUsers={allUsers}
            />

            <LeaveConversationModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onConfirm={handleLeave}
                conversationName={conversationName}
            />

            {/* Conversation */}
            <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-6">
                {/* Conversation header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex items-center justify-between h-12"
                >
                    <h2 className="flex-1 text-2xl sm:text-3xl font-bold text-text text-center">
                        {conversationName}
                    </h2>
                </motion.div>

                {/* Participants + Admin/Leave buttons */}
                {participants.length > 0 && numericConversationId !== 1 && (
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border-dark">
                        {/* Participant images */}
                        <div className="flex gap-2 flex-wrap">
                            {participants
                                .filter(u => u.id !== user.id)
                                .map((p, index) => (
                                    <motion.img
                                        key={p.id}
                                        src={p.profilePicture || "https://placehold.co/40x40"}
                                        alt={p.username}
                                        title={p.username}
                                        className={`w-10 h-10 rounded-full border-2 object-cover cursor-pointer
                                            ${onlineUsers.has(p.id) ? "border-accent-green" : "border-border-dark"}`}
                                        whileHover={{ scale: 1.1 }}
                                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        onClick={() => navigate(`/user/${p.id}`)}
                                    />
                                ))}
                        </div>

                        {/* Admin/Leave buttons */}
                        <div className="flex gap-2">
                            {isAdmin && (
                                <Button
                                    variant="secondary"
                                    size="xs"
                                    onClick={() => setIsAdminModalOpen(true)}
                                >
                                    Admin
                                </Button>
                            )}
                            {!isAdmin && (
                                <Button
                                    variant="secondary"
                                    size="xs"
                                    onClick={() => setIsLeaveModalOpen(true)}
                                >
                                    Leave
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto max-h-[70vh] flex flex-col"
                    >
                        <CardContent className="flex flex-col gap-3 p-4 sm:p-6">
                            {loading ? (
                                <div className="flex justify-center py-6">
                                    <div className="flex space-x-2">
                                        {[0, 1, 2].map((i) => (
                                            <motion.span
                                                key={i}
                                                className="w-3 h-3 bg-text rounded-full"
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    if (msg.type === "SYSTEM") {
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-center text-text-muted italic text-sm my-2"
                                            >
                                                {msg.text}
                                            </motion.div>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex gap-3 items-start ${msg.sender?.id === user.id ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            {msg.sender?.id !== user.id && (
                                                <img
                                                    src={msg.sender?.profilePicture || "https://placehold.co/48x48"}
                                                    alt={msg.sender?.username}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer"
                                                    onClick={() => navigate(`/user/${msg.sender?.id}`)}
                                                />
                                            )}
                                            <div
                                                className={`px-4 py-2 rounded-2xl max-w-[70%] sm:max-w-[60%] ${msg.sender?.id === user.id
                                                    ? "bg-accent-green-dark text-text self-end"
                                                    : "bg-white/20 text-text"
                                                    }`}
                                            >
                                                {msg.sender?.id !== user.id && (
                                                    <strong className="block text-sm text-gray-300 mb-1">
                                                        {msg.sender?.username}
                                                    </strong>
                                                )}
                                                {msg.text}
                                                <div className="text-xs text-text mt-1">
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            {typingUsers.length > 0 && (
                                <div className="text-sm text-gray-300 italic">
                                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                                </div>
                            )}
                        </CardContent>

                        {/* Message input */}
                        <CardFooter className="flex gap-3 flex-col justify-center items-center sm:flex-row w-full mt-2">
                            <TextInput
                                value={newMessage}
                                onChange={(e) => handleTyping(e.target.value)}
                                placeholder="Type your message..."
                                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                disabled={sending}
                            />
                            <Button
                                onClick={handleSendMessage}
                                variant="primary"
                                className="w-full sm:w-auto"
                                loading={sending}
                                loadingText="Sending..."
                            >
                                Send
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </PageWrapper>
    );
};