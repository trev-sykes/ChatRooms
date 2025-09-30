import { motion } from "framer-motion";
import React from "react";

interface BackgroundOrbsProps {
    variant?: "auth" | "login" | "home" | "chat"; // presets
}

export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({ variant = "auth" }) => {
    const orbBase = "hidden md:block md:absolute rounded-full blur-3xl z-0";

    switch (variant) {
        case "auth":
            return (
                <>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                        className={`${orbBase} w-[24rem] h-[24rem] bg-indigo-500/20 top-20 left-8`}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className={`${orbBase} w-[20rem] h-[20rem] bg-purple-500/20 bottom-12 right-16`}
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
                        className={`${orbBase} w-[22rem] h-[22rem] bg-pink-500/20 top-20 left-8`}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className={`${orbBase} w-[18rem] h-[18rem] bg-yellow-400/20 bottom-12 right-16`}
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
                        className={`${orbBase} w-[28rem] h-[28rem] bg-green-500/20 top-10 -left-24`}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className={`${orbBase} w-[24rem] h-[24rem] bg-blue-500/20 bottom-8 -right-20`}
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
                        className={`${orbBase} w-[20rem] h-[20rem] bg-indigo-400/20 top-16 -left-16`}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className={`${orbBase} w-[22rem] h-[22rem] bg-purple-400/20 bottom-12 -right-16`}
                    />
                </>
            );

        default:
            return null;
    }
};