import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Switch } from "../ui/Switch";
import { deleteConversation, updateConversationName, updateConversation, fetchConversation } from "../../api/conversations";
import { ConfirmationModal } from "./ConfirmModal";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface ConversationUser {
    id: number;
    username: string;
    profilePicture?: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
}

interface AdminModalProps {
    token: any;
    isOpen: boolean;
    onClose: () => void;
    participants: ConversationUser[];
    currentUserId: number;
    isOwner: boolean;
    conversationId: number;
    conversationName: string;
    isPublic: boolean;
    onRemoveUser: (userId: number) => void;
    onInviteClick: () => void;
    onLeave?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
    token,
    isOpen,
    onClose,
    participants,
    isOwner,
    conversationId,
    conversationName,
    isPublic: initialIsPublic,
    onRemoveUser,
    onInviteClick,
}) => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [editingName, setEditingName] = useState<string>("");
    const [isSavingName, setIsSavingName] = useState(false);
    const [isPublic, setIsPublic] = useState(initialIsPublic || false);
    const [isSavingPublic, setIsSavingPublic] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: "remove" | "delete";
        userId?: number;
        username?: string;
    } | null>(null);
    // Initialize conversation state when modal opens
    useEffect(() => {
        if (isOpen && conversationId) {
            isSavingPublic;
            setEditingName(conversationName || "");
            fetchConversation(conversationId, token)
                .then(conv => setIsPublic(conv.isPublic))
                .catch(err => console.error(err));
        }
    }, [isOpen, conversationId, conversationName, token]);

    const handleSaveName = async () => {
        if (!conversationId || !editingName.trim()) return;
        setIsSavingName(true);
        try {
            const updated = await updateConversationName(conversationId, token, editingName.trim());
            setEditingName(updated.name);
        } catch (err) {
            console.error("Failed to update conversation name:", err);
        } finally {
            setIsSavingName(false);
        }
    };

    const handleConfirmRemove = () => {
        if (confirmAction?.type === "remove" && confirmAction.userId) {
            onRemoveUser(confirmAction.userId);
            setConfirmAction(null);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Manage Conversation"
                footer={<Button variant="secondary" size="sm" onClick={onClose}>Close</Button>}
            >
                <div className="flex flex-col gap-4">
                    {/* Conversation Name */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-400 mb-1 block">Conversation Name</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 p-2 rounded bg-white/5 text-white text-sm outline-none"
                                disabled={!isOwner || isSavingName}
                            />
                            {isOwner && (
                                <Button variant="primary" size="sm" onClick={handleSaveName} disabled={isSavingName}>
                                    {isSavingName ? "Saving..." : "Save"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Participants */}
                    <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-3">Participants</h4>
                        <ul className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                            {participants.filter(p => p.id !== user?.id).map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <img
                                            src={p.profilePicture || "https://placehold.co/32x32"}
                                            alt={p.username}
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <span className="text-sm truncate">{p.username}</span>
                                        <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">{p.role}</span>
                                    </div>
                                    {isOwner && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() =>
                                                setConfirmAction({ type: "remove", userId: p.id, username: p.username })
                                            }
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Actions */}
                    <Button variant="primary" size="sm" onClick={onInviteClick} className="w-full">
                        Invite Users
                    </Button>
                    {isOwner && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmAction({ type: "delete" })}
                            className="w-full"
                        >
                            Delete Conversation
                        </Button>
                    )}
                </div>
                {/* Public Visibility */}
                {isOwner && (
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted">
                                Public Conversation
                            </label>
                            <p className="text-xs text-gray-400">
                                {isPublic
                                    ? "This conversation is visible to everyone."
                                    : "This conversation is private and only visible to participants."}
                            </p>
                        </div>
                        <Switch
                            checked={isPublic}
                            onCheckedChange={async (checked) => {
                                setIsPublic(checked);
                                setIsSavingPublic(true);
                                try {
                                    const updated = await updateConversation(conversationId, token, { isPublic: checked });
                                    setIsPublic(updated.conversation.isPublic);
                                } catch (err) {
                                    console.error("Failed to update conversation visibility:", err);
                                    setIsPublic(!checked); // revert on error
                                } finally {
                                    setIsSavingPublic(false);
                                }
                            }}
                        />
                    </div>
                )}
            </Modal>

            {/* Remove User Modal */}
            <ConfirmationModal
                isOpen={confirmAction?.type === "remove"}
                title="Remove User?"
                action="Remove"
                description={`Are you sure you want to remove ${confirmAction?.username}?`}
                onConfirm={handleConfirmRemove}
                onClose={setConfirmAction}
            />

            {/* Delete Conversation Modal */}
            <ConfirmationModal
                isOpen={confirmAction?.type === "delete"}
                title="Delete Conversation"
                action="Delete"
                description="Are you sure you want to delete this conversation? This cannot be undone."
                onConfirm={async () => {
                    try {
                        await deleteConversation(conversationId, token);
                    } finally {
                        navigate("/home");
                    }
                }}
                onClose={setConfirmAction}
            />
        </>
    );
};
