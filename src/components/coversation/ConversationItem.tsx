import React from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "../ui/Card";

type User = {
    id: number;
    username: string;
    profilePicture?: string;
};

type ConversationItemProps = {
    name?: string | null;
    users: User[];
    messageCount?: number;
    onClick?: () => void;
    className?: string;
};

export const ConversationItem: React.FC<ConversationItemProps> = ({
    name,
    users,
    messageCount,
    onClick,
    className,
}) => {
    const { user } = useUser();
    const otherUser = users.find((u) => u.id !== user?.id) || users[0];
    const displayName = name || otherUser.username;
    const avatarUrl =
        otherUser?.profilePicture ||
        "https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg";

    return (
        <motion.li
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`cursor-pointer ${className || ""}`}
        >
            <Card className="bg-white/5 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-300/30 transition-all duration-300 hover:scale-105">
                <CardContent className="flex items-center gap-4">
                    {/* Avatar */}
                    <motion.img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-14 h-14 rounded-full object-cover shadow-sm"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Info */}
                    <div className="flex flex-col justify-center flex-1">
                        <span className="font-semibold text-gray-100 text-base">
                            {displayName}
                        </span>
                        {messageCount !== undefined && (
                            <span className="text-gray-400 text-sm opacity-80">
                                {messageCount}{" "}
                                {messageCount === 1 ? "message" : "messages"}
                            </span>
                        )}
                    </div>

                    {/* Right arrow */}
                    <div className="text-gray-400 text-lg">&rarr;</div>
                </CardContent>
                {messageCount !== undefined && (
                    <CardFooter className="text-xs text-gray-500">
                        Last updated just now {/* Placeholder, you could wire real data */}
                    </CardFooter>
                )}
            </Card>
        </motion.li>
    );
};
