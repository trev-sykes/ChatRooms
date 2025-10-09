import { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { AnimatePresence } from "framer-motion";
import { createConversation } from "../../api/conversations";
import { Loader } from "../ui/Loader";
import { UserSearchList } from "../ui/UserSearchList";

interface Props {
    token: string;
    isOpen: boolean;
    onClose: () => void;
    onCreated: (conversation: any) => void;
    allUsers: { id: number; username: string }[];
}

export const NewConversationModal: React.FC<Props> = ({
    token,
    isOpen,
    onClose,
    onCreated,
    allUsers
}) => {
    const [name, setName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleUserSelection = (id: number) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (selectedUserIds.length === 0)
            return alert("Select at least one member");

        setLoading(true);
        try {
            const conversation = await createConversation(token, selectedUserIds, name);
            onCreated(conversation);
            onClose();
            setName("");
            setSelectedUserIds([]);
        } catch (err: any) {
            alert(err.response?.data?.error || err.message || "Failed to create conversation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={onClose} title="Create New Conversation">
                    <div className="flex flex-col gap-4">
                        <TextInput
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Conversation Name (optional)"
                        />

                        {/* 🧩 Reusable User Search List */}
                        <UserSearchList
                            allUsers={allUsers}
                            selectedUserIds={selectedUserIds}
                            onToggleUser={toggleUserSelection}
                        />

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
