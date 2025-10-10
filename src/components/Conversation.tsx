import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { PageWrapper } from "./layout/PageWrapper";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter } from "./ui/Card";
import { TextInput } from "./ui/TextInput";
import { BackgroundOrbs } from "./ui/BackgroundOrbs";
import { AdminModal } from "./modals/AdminModal";
import { AddUsersModal } from "./modals/AddUsersModal";
import { LeaveConversationModal } from "./modals/LeaveConversationModal";
import {
    fetchMessages,
    fetchConversationName,
    sendMessage,
    fetchConversationUsers,
    addUsersToConversation,
    removeUserFromConversation,
    leaveConversation
} from "../api/conversations";

interface ConversationUser {
    id: number;
    username: string;
    profilePicture?: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
}

interface Message {
    id: number;
    text: string;
    sender: {
        id: number;
        username: string;
        profilePicture?: string;
    };
    createdAt: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Conversation: React.FC = () => {
    const navigate = useNavigate();
    const { token, user } = useUser();
    const { conversationId } = useParams<{ conversationId: string }>();
    const [participants, setParticipants] = useState<ConversationUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationName, setConversationName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [allUsers, setAllUsers] = useState<ConversationUser[]>([]);
    const numericConversationId = Number(conversationId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleAddUsers = async () => {
        if (!selectedUsers.length) return;
        try {
            await addUsersToConversation(numericConversationId, token!, selectedUsers);
            const users = await fetchConversationUsers(numericConversationId, token!);
            setParticipants(users);
            setIsAddUserModalOpen(false);
            setSelectedUsers([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveUser = async (userIdToRemove: number) => {
        try {
            await removeUserFromConversation(numericConversationId, token!, userIdToRemove);
            setParticipants(prev => prev.filter(p => p.id !== userIdToRemove));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLeaveConversation = async () => {
        if (numericConversationId === 1) return;
        try {
            await leaveConversation(numericConversationId, token!);
            navigate("/home");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !token || !numericConversationId) return;

        const tempMessage: Message = {
            id: Date.now(),
            text: newMessage,
            sender: { id: user!.id, username: user!.username },
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage("");
        setSending(true);

        try {
            const message = await sendMessage(numericConversationId, token, newMessage);
            setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? message : msg));
        } catch (err) {
            console.error(err);
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (!token || !numericConversationId) return;

        const loadConversation = async () => {
            try {
                setLoading(true);
                const [msgs, name, users] = await Promise.all([
                    fetchMessages(numericConversationId, token),
                    fetchConversationName(numericConversationId, token, user!.id),
                    fetchConversationUsers(numericConversationId, token),
                ]);
                setMessages(msgs);
                setConversationName(name);
                setParticipants(users);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadConversation();
    }, [token, conversationId]);

    // Fetch all users for the add users modal
    useEffect(() => {
        if (!token) return;

        const fetchAllUsers = async () => {
            try {
                const res = await fetch(`${BASE_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    // Filter out users already in the conversation
                    const participantIds = new Set(participants.map(p => p.id));
                    const availableUsers = data.users.filter((u: ConversationUser) => !participantIds.has(u.id));
                    setAllUsers(availableUsers);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (isAdminModalOpen) {
            fetchAllUsers();
        }
    }, [token, isAdminModalOpen, participants]);
    useEffect(() => {
        if (!token || !numericConversationId) return;

        const markAsRead = async () => {
            try {
                await fetch(`${BASE_URL}/messages/${numericConversationId}/read`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (err) {
                console.error("Error marking messages as read:", err);
            }
        };

        markAsRead();

        // Then load messages
        const loadConversation = async () => {
            try {
                setLoading(true);
                const [msgs, name, users] = await Promise.all([
                    fetchMessages(numericConversationId, token),
                    fetchConversationName(numericConversationId, token, user!.id),
                    fetchConversationUsers(numericConversationId, token),
                ]);
                setMessages(msgs);
                setConversationName(name);
                setParticipants(users);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadConversation();
    }, [token, conversationId]);

    const currentUserParticipant = participants.find(p => p.id === user!.id);
    const isAdmin = currentUserParticipant?.role === "ADMIN" || currentUserParticipant?.role === "OWNER";
    const isOwner = currentUserParticipant?.role === "OWNER";

    return (
        <PageWrapper centered>
            <BackgroundOrbs variant="chat" />

            {/* Modals */}
            {isAdmin && (
                <AdminModal
                    isOpen={isAdminModalOpen}
                    onClose={() => setIsAdminModalOpen(false)}
                    participants={participants}
                    currentUserId={user!.id}
                    isOwner={isOwner}
                    conversationId={numericConversationId}
                    onRemoveUser={handleRemoveUser}
                    onInviteClick={() => setIsAddUserModalOpen(true)}
                    onLeave={handleLeaveConversation}
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
                onConfirm={handleLeaveConversation}
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
                    <h2 className="flex-1 text-2xl sm:text-3xl font-bold text-white text-center">
                        {conversationName}
                    </h2>
                    <div className="flex gap-2">
                    </div>
                </motion.div>
                {/* Participants + Admin/Leave buttons */}
                {participants.length > 0 && numericConversationId !== 1 && (
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">

                        {/* Participant images */}
                        <div className="flex gap-2 flex-wrap">
                            {participants.map((p, index) => (
                                <motion.img
                                    key={p.id}
                                    src={p.profilePicture || "https://placehold.co/40x40"}
                                    alt={p.username}
                                    title={p.username}
                                    className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => navigate(`/user/${p.id}`)}
                                />
                            ))}
                        </div>

                        {/* Grouped Admin + Leave buttons */}
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
                            <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => setIsLeaveModalOpen(true)}
                            >
                                Leave
                            </Button>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="flex-1 overflow-y-auto max-h-[70vh] flex flex-col">
                        <CardContent className="flex flex-col gap-3 p-4 sm:p-6">
                            {loading ? (
                                <div className="flex justify-center py-6">
                                    <div className="flex space-x-2">
                                        {[0, 1, 2].map(i => (
                                            <motion.span
                                                key={i}
                                                className="w-3 h-3 bg-white rounded-full"
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map(msg => (
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
                                        <div className={`px-4 py-2 rounded-2xl max-w-[70%] sm:max-w-[60%] ${msg.sender.id === user?.id ? "bg-indigo-600 text-white self-end" : "bg-white/20 text-white"}`}>
                                            <strong>{msg.sender.username}</strong>: {msg.text}
                                            <div className="text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Message input */}
                        <CardFooter className="flex gap-3 flex-col sm:flex-row w-full mt-2">
                            <TextInput
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
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