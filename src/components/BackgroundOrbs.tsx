// components/effects/BackgroundOrbs.tsx
import { motion } from "framer-motion";
import React from "react";

interface BackgroundOrbsProps {
    variant?: "auth" | "login" | "home" | "chat"; // presets
}

export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({ variant = "auth" }) => {
    switch (variant) {
        case "auth":
            return (
                <>
                    {/* Top-left orb */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute w-[24rem] h-[24rem] bg-indigo-500/20 rounded-full blur-3xl top-20 left-8 z-0"
                    />
                    {/* Bottom-right orb */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="absolute w-[20rem] h-[20rem] bg-purple-500/20 rounded-full blur-3xl bottom-12 right-16 z-0"
                    />
                </>
            );

        case "login":
            return (
                <>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute w-[22rem] h-[22rem] bg-pink-500/20 rounded-full blur-3xl top-20 left-8 z-0"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="absolute w-[18rem] h-[18rem] bg-yellow-400/20 rounded-full blur-3xl bottom-12 right-16 z-0"
                    />
                </>
            );

        case "home":
            return (
                <>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute w-[28rem] h-[28rem] bg-green-500/20 rounded-full blur-3xl top-10 -left-24 z-0"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="absolute w-[24rem] h-[24rem] bg-blue-500/20 rounded-full blur-3xl bottom-8 -right-20 z-0"
                    />
                </>
            );

        case "chat":
            return (
                <>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute w-[20rem] h-[20rem] bg-indigo-400/20 rounded-full blur-3xl top-16 -left-16 z-0"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="absolute w-[22rem] h-[22rem] bg-purple-400/20 rounded-full blur-3xl bottom-12 -right-16 z-0"
                    />
                </>
            );

        default:
            return null;
    }
};
