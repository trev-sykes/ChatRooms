import React from "react";
import { motion } from "framer-motion";

type TextInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    error?: string;
    className?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    className,
}) => {
    return (
        <div className="flex flex-col w-full mb-6 relative">
            <motion.input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-3 rounded-xl text-sm
                    bg-white/10 text-white placeholder-gray-400
                    backdrop-blur-md outline-none
                    transition-all duration-300
                    border ${error ? "border-red-500" : "border-gray-500/30"}
                    shadow ${error ? "shadow-red-400/40" : "shadow-gray-700/20"}
                    focus:border-indigo-400 focus:shadow-indigo-300/30
                    ${className || ""}
                `}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            />
            {error && (
                <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute -bottom-5 left-1 text-red-500 text-xs"
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
};
