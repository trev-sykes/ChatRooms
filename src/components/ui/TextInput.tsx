import React from "react";
import { motion } from "framer-motion";

type TextInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // 👈 add this
};

export const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    className,
    onKeyDown, // 👈 include here
    disabled
}) => {
    return (
        <div className="flex flex-col w-full  relative">
            <motion.input
                type={type}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown} // 👈 pass it down
                placeholder={placeholder}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 rounded-xl text-text
                    bg-white/10 text-base text-text placeholder-text-muted
                    backdrop-blur-md outline-none
                    transition-all duration-300
                    border ${error ? "border-accent-red" : "border-surface/30"}
                    shadow ${error ? "shadow-accent-red/40" : "shadow-surface/20"}
                    focus:border-accent-blue focus:shadow-accent-blue/30
                    ${className || ""}
                `}
            />
            {error && (
                <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute -bottom-5 left-1 text-accent-red text-xs"
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
};
