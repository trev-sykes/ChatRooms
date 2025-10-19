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
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                {/* Header */}
                <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Conversations</h2>
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
                <div className="px-6 py-3 border-b border-slate-700 bg-slate-800/50">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
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
                                className="divide-y divide-slate-700"
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
                            <div className="p-6 text-center text-gray-400">
                                {searchTerm ? "No conversations found" : "No conversations yet"}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-700 px-6 py-3 bg-slate-800/50">
                    <p className="text-xs text-gray-500">
                        {filteredConversations.length} of {conversations.length} conversations
                    </p>
                </div>
            </div>
        </motion.div>
    );
};