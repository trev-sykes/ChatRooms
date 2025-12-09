import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "cta" | "login" | "destructive";
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
            "bg-accent-blue text-text hover:bg-accent-blue-light hover:shadow-lg hover:shadow-indigo-500/30",
        secondary:
            "bg-transparent  border-2 border-accent-blue rounded text-text b-rounded bc-accent-blue hover:border-accent-blue-light",
        cta:
            "w-full mt-6 py-3 rounded-xl bg-accent-blue text-text font-semibold shadow-lg hover:opacity-90 transition-all",
        login:
            "w-full mt-6 py-3 rounded-xl bg-accent-green text-text font-semibold shadow-lg hover:opacity-90 transition-all",
        destructive:
            "bg-red-600 text-text hover:bg-accent-red hover:shadow-lg hover:shadow-red-500/30", // ✅ new variant
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
