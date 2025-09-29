import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary";
    className?: string;
    disabled?: boolean;              // 👈 allow manual disable
    loading?: boolean;               // 👈 new: loading state
    loadingText?: string;            // 👈 optional text while loading
};

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    className,
    disabled = false,
    loading = false,
    loadingText = "Submitting...",   // 👈 default
}) => {
    const baseStyles =
        "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30",
        secondary:
            "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md hover:shadow-gray-400/30",
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled || loading}   // 👈 prevent clicks
            className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
        >
            {loading ? loadingText : children} {/* 👈 swap label */}
        </motion.button>
    );
};
