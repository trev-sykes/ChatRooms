import React from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "./Card";

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
    const otherUsers = users.filter((u) => u.id !== user?.id);

    const displayName = name || otherUsers.map((u) => u.username).join(", ");

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`cursor-pointer ${className || ""}`}
            role="button"
            tabIndex={0}
        >
            <Card className="bg-white/5 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-300/30 transition-all duration-300 hover:scale-105">
                <CardContent className="flex items-center gap-4">
                    {/* Group avatar */}
                    <div className="flex -space-x-2">
                        {otherUsers.length > 0 ? (
                            otherUsers.slice(0, 3).map((u, index) => (
                                <motion.img
                                    key={u.id}
                                    src={
                                        u.profilePicture ||
                                        "https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg"
                                    }
                                    alt={u.username}
                                    className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                                    style={{ zIndex: otherUsers.length - index }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            ))
                        ) : (
                            <img
                                src="https://i.pinimg.com/1200x/f4/97/b3/f497b38e143979c996349a4cc8f8fbb7.jpg"
                                alt="default"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}
                        {otherUsers.length > 3 && (
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-xs font-semibold border-2 border-gray-800">
                                +{otherUsers.length - 3}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center flex-1 ml-2">
                        <span className="font-semibold text-gray-100 text-base">{displayName}</span>
                        {messageCount !== undefined && (
                            <span className="text-gray-400 text-sm opacity-80">
                                {messageCount} {messageCount === 1 ? "message" : "messages"}
                            </span>
                        )}
                    </div>

                    {/* Right arrow */}
                    <div className="text-gray-400 text-lg">&rarr;</div>
                </CardContent>

                {messageCount !== undefined && (
                    <CardFooter className="text-xs text-gray-500">
                        Last updated just now {/* Placeholder */}
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
};
