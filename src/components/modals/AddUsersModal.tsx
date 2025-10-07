// AddUsersModal.tsx
import { useState } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { TextInput } from "../ui/TextInput";
import { motion } from "framer-motion";

interface User {
    id: number;
    username: string;
    profilePicture?: string;
}

interface AddUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUsers: number[];
    onSelectedUsersChange: (users: number[]) => void;
    onAdd: () => void;
    availableUsers?: User[];
}

export const AddUsersModal: React.FC<AddUsersModalProps> = ({
    isOpen,
    onClose,
    selectedUsers,
    onSelectedUsersChange,
    onAdd,
    availableUsers = [],
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter users based on search query
    const filteredUsers = availableUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUserSelection = (id: number) => {
        onSelectedUsersChange(
            selectedUsers.includes(id)
                ? selectedUsers.filter(uid => uid !== id)
                : [...selectedUsers, id]
        );
    };

    const handleClose = () => {
        setSearchQuery("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Users"
            footer={
                <>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        disabled={!selectedUsers.length}
                    >
                        Add
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-3">
                {/* Search input */}
                <TextInput
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />

                {/* User selection list */}
                {availableUsers.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-white/10 rounded-lg p-2">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <motion.button
                                    key={user.id}
                                    type="button"
                                    onClick={() => toggleUserSelection(user.id)}
                                    className={`flex items-center gap-2 p-2 rounded transition-all ${selectedUsers.includes(user.id)
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white/5 text-gray-200 hover:bg-white/10"
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <img
                                        src={user.profilePicture || "https://placehold.co/32x32"}
                                        alt={user.username}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="flex-1 text-left text-sm">{user.username}</span>
                                    {selectedUsers.includes(user.id) && (
                                        <span className="text-lg">✓</span>
                                    )}
                                </motion.button>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-4 text-sm">
                                No users found
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-4 text-sm">
                        No users available
                    </div>
                )}

                {/* Selected count */}
                {selectedUsers.length > 0 && (
                    <div className="text-xs text-gray-300 bg-white/5 p-2 rounded">
                        {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                    </div>
                )}
            </div>
        </Modal>
    );
};