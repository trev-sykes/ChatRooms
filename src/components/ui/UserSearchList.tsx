import { useState, useMemo } from "react";
import { TextInput } from "./TextInput";
import { motion, AnimatePresence } from "framer-motion"; // ✅ import AnimatePresence
import { Loader } from "./Loader";
import { useDebounce } from "../../hooks/useDebounce";

interface User {
    id: number;
    username: string;
}

interface Props {
    allUsers: User[];
    selectedUserIds: number[];
    onToggleUser: (id: number) => void;
    showAllByDefault?: boolean;
    debounceDelay?: number;
    showResultsInitially?: boolean;
}

export const UserSearchList: React.FC<Props> = ({
    allUsers,
    selectedUserIds,
    onToggleUser,
    showAllByDefault = false,
    showResultsInitially = false,
    debounceDelay = 300,
}) => {
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, debounceDelay);

    const filteredUsers = useMemo(() => {
        if (!showAllByDefault && debouncedSearch.trim() === "") return [];
        return allUsers.filter(user =>
            user.username.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [debouncedSearch, allUsers, showAllByDefault]);

    const noResults = debouncedSearch.trim() !== "" && filteredUsers.length === 0;

    const shouldShowResults =
        showResultsInitially || debouncedSearch.trim() !== "";

    return (
        <div className="flex flex-col gap-2">
            <TextInput
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="mb-1"
            />

            <AnimatePresence>
                {shouldShowResults && (
                    <motion.div
                        key="results"
                        className="flex flex-col gap-2 max-h-48 overflow-y-auto border rounded p-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {search && debouncedSearch !== search ? (
                            <Loader /> // show loader while debounce is active
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <motion.button
                                    key={user.id}
                                    type="button"
                                    onClick={() => onToggleUser(user.id)}
                                    className={`flex justify-between items-center p-2 rounded hover:bg-gray-800 transition-colors ${selectedUserIds.includes(user.id)
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-700 text-gray-200"
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{user.username}</span>
                                    {selectedUserIds.includes(user.id) && <span>✅</span>}
                                </motion.button>
                            ))
                        ) : noResults ? (
                            <div className="text-gray-400 text-sm text-center py-2">
                                No users found
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm text-center py-2 italic">
                                Start typing to search users...
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
