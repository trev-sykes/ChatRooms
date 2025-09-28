import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary";
    className?: string;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    className,
}) => {
    const baseStyles =
        "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md";

    const variantStyles = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30",
        secondary:
            "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md hover:shadow-gray-400/30",
    };

    return (
        <motion.button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
};
