import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { usePublicConversations } from "../hooks/usePublicConversations";
import { Loader } from "./ui/Loader";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { NewConversationModal } from "./modals/NewConversationModal";

export const PublicConversationList = () => {
    const { user, token } = useUser();
    const navigate = useNavigate();
    const { conversations, loadMore, hasMore, loading, error } = usePublicConversations();
    const [isNewPublicOpen, setIsNewPublicOpen] = useState(false);

    const goToConversation = (id: number) => navigate(`/conversation/${id}`);

    const handleCreatedConversation = (conversation: any) => {
        goToConversation(conversation.id);
    };

    if (!user) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center text-[var(--color-text-muted)] text-lg px-4">
                Log in to view public conversations.
            </div>
        );
    }

    if (loading && conversations.length === 0) return <Loader />;

    if (error) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center px-4">
                <p className="text-[var(--color-accent-red)]">{error}</p>
            </div>
        );
    }

    const filteredConversations = conversations.filter(conv => conv.id !== 1);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with New Public Conversation Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex-1">

                        <p className="text-text-muted text-sm sm:text-base">
                            Discover and join conversations from the community
                        </p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setIsNewPublicOpen(true)}>
                        + New Public Conversation
                    </Button>
                </div>

                {/* Conversations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredConversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => goToConversation(conv.id)}
                            className="cursor-pointer bg-surface border border-border rounded-lg p-4 hover:bg-surface-dark transition-all duration-200 flex flex-col justify-between"
                        >
                            <div className="mb-2">
                                <div className="flex justify-between items-start mb-1 gap-2">
                                    <h3 className="font-semibold text-text truncate flex-1">
                                        {conv.name || "Unnamed conversation"}
                                    </h3>
                                    <span className="text-xs text-text-muted flex-shrink-0 flex items-center gap-1">
                                        👁 {conv.views ?? 0}
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-text-muted mb-2 truncate">
                                    Created by <span className="text-accent-blue-light">{conv.createdBy?.username || "Anonymous"}</span>
                                </p>

                                {conv.messages?.[0] && (
                                    <div className="bg-surface-dark rounded p-2 mb-2 text-xs sm:text-sm line-clamp-2">
                                        <strong className="text-accent-green">
                                            {conv.messages[0].sender?.username || "Unknown"}:
                                        </strong>{" "}
                                        {conv.messages[0].text || ""}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-text-muted pt-2 border-t border-border-dark">
                                <span className="flex items-center gap-1">
                                    👥 {conv._count?.users ?? 0} members
                                </span>
                                <span className="flex items-center gap-1">
                                    💬 {conv._count?.messages ?? 0} messages
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="px-6 py-3 bg-surface border border-border rounded-lg text-text hover:bg-surface-dark hover:border-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-cyan"></div>
                                    Loading...
                                </span>
                            ) : (
                                "Load More"
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* New Public Conversation Modal */}
            <NewConversationModal
                token={token!}
                isOpen={isNewPublicOpen}
                onClose={() => setIsNewPublicOpen(false)}
                onCreated={handleCreatedConversation}
                allUsers={[]} // No user selection for public
                forcePublic={true}
            />
        </motion.div>
    );
};
