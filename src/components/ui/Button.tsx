import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "cta" | "login";
    size?: "xs" | "sm" | "md" | "lg";      // 👈 add size prop
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",                    // 👈 default size
    className,
    disabled = false,
    loading = false,
    loadingText = "Submitting...",
}) => {
    const baseStyles =
        "rounded-xl font-semibold text-sm transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-lg",
    };

    const variantStyles = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30",
        secondary:
            "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md hover:shadow-gray-400/30",
        cta:
            "w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all",
        login:
            "w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:opacity-90 transition-all",
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ""}`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
        >
            {loading ? loadingText : children}
        </motion.button>
    );
};
