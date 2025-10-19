import { motion } from "framer-motion";
import type { Conversation } from "../../types/conversation";

interface ConversationItemProps {
    conversation: Conversation;
    currentUserId: number;
    unreadCount: number;
    index: number;
    onClick: () => void;
}

export const ConversationItem = ({
    conversation,
    currentUserId,
    unreadCount,
    index,
    onClick
}: ConversationItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="px-6 py-4 hover:bg-slate-700/40 cursor-pointer transition-colors duration-150 group"
        >
            <div className="flex items-center justify-between">
                {/* Conversation Info */}
                <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {conversation.name ||
                            conversation.users
                                .map((u) => u.username)
                                .join(", ")}
                        {/* Unread Badge */}
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} unread • ${conversation._count?.messages || 0} total`
                            : `${conversation._count?.messages || 0} messages`}
                    </p>
                </div>

                {/* User Avatars */}
                <div className="flex -space-x-2 ml-4">
                    {conversation.users.length > 0 ? (
                        conversation.users
                            .filter(u => u.id !== currentUserId)
                            .slice(0, 3)
                            .map((u, idx) => (
                                <motion.img
                                    key={u.id}
                                    src={
                                        u.profilePicture ||
                                        "https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg"
                                    }
                                    alt={u.username}
                                    className="w-9 h-9 rounded-full border-2 border-slate-800 object-cover"
                                    style={{ zIndex: conversation.users.length - idx }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            ))
                    ) : (
                        <img
                            src="https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg"
                            alt="default"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    )}
                    {conversation.users.length > 3 && (
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-700 text-xs font-semibold border-2 border-slate-800 text-gray-200">
                            +{conversation.users.length - 3}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};