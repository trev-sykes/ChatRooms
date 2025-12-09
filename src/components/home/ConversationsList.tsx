import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "../../types/conversation";

interface ConversationsListProps {
    conversations: Conversation[];
    filteredConversations: Conversation[];
    loading: boolean;
    searchTerm: string;
    currentUserId: number;
    unread: Record<number, number>;
    onSearchChange: (value: string) => void;
    onNewConversation: () => void;
    onConversationClick: (id: number) => void;
}

export const ConversationsList = ({
    conversations,
    filteredConversations,
    loading,
    searchTerm,
    currentUserId,
    unread,
    onSearchChange,
    onNewConversation,
    onConversationClick
}: ConversationsListProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
        >
            <div className="bg-surface border border-border-dark rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                {/* Header */}
                <div className="border border-border-dark px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-text">Conversations</h2>
                    <Button
                        variant="primary"
                        size="xs"
                        onClick={onNewConversation}
                        className="flex items-center justify-center gap-2 md:px-6 md:py-3 md:text-sm px-3 py-1 text-xs"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Conversation</span>
                        <span className="inline sm:hidden">New Convo</span>
                    </Button>
                </div>

                {/* Search */}
                <div className="px-6 py-3 border-b border-border-dark bg-surface-dark/50">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-text-muted placeholder-text-muted focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="p-6 text-center">
                                <Loader />
                            </div>
                        ) : filteredConversations.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="divide-y divide-surface-dark"
                            >
                                {filteredConversations.map((convo, index) => (
                                    <ConversationItem
                                        key={convo.id}
                                        conversation={convo}
                                        currentUserId={currentUserId}
                                        unreadCount={unread[convo.id] || 0}
                                        index={index}
                                        onClick={() => onConversationClick(convo.id)}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="p-6 text-center text-text-muted">
                                {searchTerm ? "No conversations found" : "No conversations yet"}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-surface-dark px-6 py-3 bg-surface-dark/50">
                    <p className="text-xs text-gray-500">
                        {filteredConversations.length} of {conversations.length} conversations
                    </p>
                </div>
            </div>
        </motion.div>
    );
};