import { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { AnimatePresence } from "framer-motion";
import { createConversation, createPublicConversation } from "../../api/conversations";
import { Loader } from "../ui/Loader";
import { UserSearchList } from "../ui/UserSearchList";
interface Props {
    token: string;
    isOpen: boolean;
    onClose: () => void;
    onCreated: (conversation: any) => void;
    allUsers: { id: number; username: string }[];
    forcePublic?: boolean; // new
}

export const NewConversationModal: React.FC<Props> = ({
    token,
    isOpen,
    onClose,
    onCreated,
    allUsers,
    forcePublic = false, // default false
}) => {
    const [name, setName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(forcePublic);

    const toggleUserSelection = (id: number) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!isPublic && selectedUserIds.length === 0) {
            return alert("Select at least one member for a private conversation");
        }

        setLoading(true);
        try {
            let conversation;
            if (isPublic) {
                conversation = await createPublicConversation(token, name, []); // no users needed
            } else {
                conversation = await createConversation(token, selectedUserIds, name);
            }

            onCreated(conversation);
            onClose();
            setName("");
            setSelectedUserIds([]);
            setIsPublic(forcePublic);
        } catch (err: any) {
            alert(err.response?.data?.error || err.message || "Failed to create conversation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={onClose} title={forcePublic ? "Create Public Conversation" : "Create New Conversation"}>
                    <div className="flex flex-col gap-4">
                        <TextInput
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Conversation Name (optional)"
                        />

                        {/* Only show public checkbox if not forced */}
                        {!forcePublic && (
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={e => setIsPublic(e.target.checked)}
                                />
                                Public Conversation
                            </label>
                        )}

                        {/* Show user list only if private and not forced */}
                        {!isPublic && !forcePublic && (
                            <UserSearchList
                                allUsers={allUsers}
                                selectedUserIds={selectedUserIds}
                                onToggleUser={toggleUserSelection}
                            />
                        )}

                        <Button
                            onClick={handleCreate}
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? <Loader /> : "Create Conversation"}
                        </Button>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
};
