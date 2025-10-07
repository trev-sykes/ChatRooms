// AdminModal.tsx
import { useState } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface ConversationUser {
    id: number;
    username: string;
    profilePicture?: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
}

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    participants: ConversationUser[];
    currentUserId: number;
    isOwner: boolean;
    conversationId: number;
    onRemoveUser: (userId: number) => void;
    onInviteClick: () => void;
    onLeave: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    onClose,
    participants,
    currentUserId,
    isOwner,
    conversationId,
    onRemoveUser,
    onInviteClick,
    onLeave,
}) => {
    const [confirmAction, setConfirmAction] = useState<{
        type: "remove" | "leave";
        userId?: number;
        username?: string;
    } | null>(null);

    const handleConfirmRemove = () => {
        if (confirmAction?.type === "remove" && confirmAction.userId) {
            onRemoveUser(confirmAction.userId);
            setConfirmAction(null);
        }
    };

    const handleConfirmLeave = () => {
        if (confirmAction?.type === "leave") {
            onLeave();
            setConfirmAction(null);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Manage Conversation"
                footer={
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-3">Participants</h4>
                        <ul className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                            {participants.map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
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
                                            onClick={() => setConfirmAction({ type: "remove", userId: p.id, username: p.username })}
                                            className="ml-2"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onInviteClick}
                        className="w-full"
                    >
                        Invite Users
                    </Button>

                    {conversationId !== 1 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setConfirmAction({ type: "leave" })}
                            className="w-full"
                        >
                            Leave Conversation
                        </Button>
                    )}
                </div>
            </Modal>

            {/* Confirmation Modal for Remove User */}
            <Modal
                isOpen={confirmAction?.type === "remove"}
                onClose={() => setConfirmAction(null)}
                title="Remove User?"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setConfirmAction(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleConfirmRemove}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-3">
                    <p className="text-gray-200">
                        Are you sure you want to remove <strong>{confirmAction?.username}</strong> from this conversation?
                    </p>
                    <p className="text-sm text-gray-400">
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>

            {/* Confirmation Modal for Leave Conversation */}
            <Modal
                isOpen={confirmAction?.type === "leave"}
                onClose={() => setConfirmAction(null)}
                title="Leave Conversation?"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setConfirmAction(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleConfirmLeave}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Leave
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-3">
                    <p className="text-gray-200">
                        Are you sure you want to leave this conversation?
                    </p>
                    <p className="text-sm text-gray-400">
                        You will no longer see messages in this conversation. This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </>
    );
};