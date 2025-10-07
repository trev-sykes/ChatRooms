import { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { createConversation } from "../../api/conversations";
import { Loader } from "../ui/Loader";

interface Props {
    token: string;
    isOpen: boolean;
    onClose: () => void;
    onCreated: (conversation: any) => void;
    allUsers: { id: number; username: string }[]; // available users for invite
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
        if (selectedUserIds.length === 0) return alert("Select at least one member");

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

                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border rounded p-2">
                            {allUsers.map(user => (
                                <motion.button
                                    key={user.id}
                                    type="button"
                                    onClick={() => toggleUserSelection(user.id)}
                                    className={`flex justify-between items-center p-2 rounded hover:bg-gray-800 transition-colors ${selectedUserIds.includes(user.id) ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-200"
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{user.username}</span>
                                    {selectedUserIds.includes(user.id) && <span>✅</span>}
                                </motion.button>
                            ))}
                        </div>

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
