import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;             // 👈 make optional for submit buttons
    type?: "button" | "submit" | "reset"; // 👈 new: button type
    variant?: "primary" | "secondary" | "cta" | "login";
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",                   // 👈 default is "button"
    variant = "primary",
    className,
    disabled = false,
    loading = false,
    loadingText = "Submitting...",
}) => {
    const baseStyles =
        "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30",
        secondary:
            "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md hover:shadow-gray-400/30",
        cta:
            "w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all",
        login:  // 👈 new
            "w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:opacity-90 transition-all",
    };

    return (
        <motion.button
            type={type}                     // 👈 now supported
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
        >
            {loading ? loadingText : children}
        </motion.button>
    );
};
