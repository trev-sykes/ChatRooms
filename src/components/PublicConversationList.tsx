import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { usePublicConversations } from "../hooks/usePublicConversations";
import { Loader } from "./ui/Loader";

// const StatsCard = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
//     <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
//         <div className="flex items-center gap-3">
//             <span className="text-2xl">{icon}</span>
//             <div>
//                 <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
//                 <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
//             </div>
//         </div>
//     </div>
// );

export const PublicConversationList = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { conversations, loadMore, hasMore, loading, error } = usePublicConversations();

    const goToConversation = (id: number) => navigate(`/conversation/${id}`);

    // Calculate stats
    const filteredConversations = conversations.filter((conv) => conv.id !== 1);
    // const totalConversations = filteredConversations.length;
    // const totalMembers = conversations.reduce((sum, conv) => sum + (conv._count?.users ?? 0), 0);
    // const totalMessages = conversations.reduce((sum, conv) => sum + (conv._count?.messages ?? 0), 0);

    if (!user) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center text-[var(--color-text-muted)] text-lg">
                Log in to view public conversations.
            </div>
        );
    }

    if (loading && conversations.length === 0) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <p className="text-[var(--color-accent-red)]">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2">
                    Public Conversations
                </h1>
                <p className="text-[var(--color-text-muted)]">
                    Discover and join conversations from the community
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* <StatsCard label="Conversations" value={totalConversations} icon="💬" />
                <StatsCard label="Total Members" value={totalMembers} icon="👥" />
                <StatsCard label="Messages" value={totalMessages} icon="📨" /> */}
            </div>

            {/* Conversations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => goToConversation(conv.id)}
                        className="cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:bg-[var(--color-surface-dark)] hover:border-[var(--color-accent-cyan)] transition-all duration-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-[var(--color-text)] truncate flex-1">
                                {conv.name || "Unnamed conversation"}
                            </h3>
                            <span className="text-sm text-[var(--color-text-muted)] ml-2 flex items-center gap-1">
                                👁 {conv.views ?? 0}
                            </span>
                        </div>

                        <p className="text-sm text-[var(--color-text-muted)] mb-3">
                            Created by <span className="text-[var(--color-accent-cyan)]">{conv.createdBy?.username || "Unknown"}</span>
                        </p>

                        {conv.messages?.[0] && (
                            <div className="bg-[var(--color-surface-dark)] rounded p-2 mb-3">
                                <p className="text-sm text-[var(--color-text)] line-clamp-2">
                                    <strong className="text-[var(--color-accent-blue)]">
                                        {conv.messages[0].sender?.username || "Unknown"}:
                                    </strong>{" "}
                                    {conv.messages[0].text || ""}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-dark)]">
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
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-dark)] hover:border-[var(--color-accent-cyan)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-accent-cyan)]"></div>
                                Loading...
                            </span>
                        ) : (
                            "Load More"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};