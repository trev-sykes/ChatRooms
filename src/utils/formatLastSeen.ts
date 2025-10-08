// Helper to format lastSeen
export const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "Online"; // treat null as online
    const diffMs = Date.now() - new Date(lastSeen).getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};
