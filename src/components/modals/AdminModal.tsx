// AdminModal.tsx
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { deleteConversation, updateConversationName } from "../../api/conversations";
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
    onRemoveUser: (userId: number) => void;
    onInviteClick: () => void;
    onLeave?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
    token,
    isOpen,
    onClose,
    participants,
    currentUserId,
    isOwner,
    conversationId,
    conversationName,
    onRemoveUser,
    onInviteClick,
}) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [confirmAction, setConfirmAction] = useState<{
        type: "remove" | "leave" | "delete";
        userId?: number;
        username?: string;
    } | null>(null);

    const [editingName, setEditingName] = useState<string>("");
    const [isSavingName, setIsSavingName] = useState(false);

    // Initialize conversation name when modal opens
    useEffect(() => {
        if (isOpen) {
            setEditingName(conversationName || "");
        }
    }, [isOpen, conversationName]);

    const handleConfirmRemove = () => {
        if (confirmAction?.type === "remove" && confirmAction.userId) {
            onRemoveUser(confirmAction.userId);
            setConfirmAction(null);
        }
    };

    const handleSaveName = async () => {
        if (!conversationId || !editingName.trim()) return;
        setIsSavingName(true);
        try {
            const updatedConversation = await updateConversationName(
                conversationId,
                token,
                editingName.trim()
            );
            // Optionally update local state
            setEditingName(updatedConversation.name);
            setIsSavingName(false);
        } catch (err) {
            console.error("Failed to update conversation name:", err);
            setIsSavingName(false);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Manage Conversation"
                footer={
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Close
                    </Button>
                }
            >
                <div className="flex flex-col gap-4">
                    {/* Conversation Name Editor */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-400 mb-1 block">
                            Conversation Name
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 p-2 rounded bg-white/5 text-white text-sm outline-none"
                                disabled={!isOwner || isSavingName}
                            />
                            {isOwner && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSaveName}
                                    disabled={isSavingName}
                                >
                                    {isSavingName ? "Saving..." : "Save"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Participants */}
                    <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-3">
                            Participants
                        </h4>
                        <ul className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                            {participants
                                .filter(p => p.id !== user?.id)
                                .map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex justify-between items-center p-2 bg-white/5 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <img
                                                src={p.profilePicture || "https://placehold.co/32x32"}
                                                alt={p.username}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <span className="text-sm truncate">{p.username}</span>
                                            <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                                                {p.role}
                                            </span>
                                        </div>
                                        {p.id !== currentUserId && isOwner && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    setConfirmAction({
                                                        type: "remove",
                                                        userId: p.id,
                                                        username: p.username,
                                                    })
                                                }
                                                className="ml-2"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onInviteClick}
                        className="w-full"
                    >
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
            </Modal>

            {/* Remove User Modal */}
            <ConfirmationModal
                isOpen={confirmAction?.type === "remove"}
                title={"Remove User?"}
                action={"Remove"}
                description={`Are you sure you want to remove ${confirmAction?.username} from this conversation? This action cannot be undone.`}
                onConfirm={handleConfirmRemove}
                onClose={setConfirmAction}
            />

            {/* Delete Conversation Modal */}
            <ConfirmationModal
                isOpen={confirmAction?.type === "delete"}
                title={"Delete Conversation"}
                action={"Delete"}
                description={" Are you sure you want to delete this conversation? This action cannot be undone."}
                onConfirm={async () => {
                    try {
                        await deleteConversation(conversationId, token);
                    } catch (err: any) {
                        console.error(err.message);
                    } finally {
                        navigate("/home");
                    }
                }}
                onClose={setConfirmAction}
            />
        </>
    );
};
