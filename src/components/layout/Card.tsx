// components/layout/Card.tsx
import React from "react";

interface CardProps {
    children: React.ReactNode;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
    className?: string;
    marginBottom?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    padding = "16px",
    borderRadius = "12px",
    boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)",
    className = "",
    marginBottom = '6px'
}) => {
    const mobileStyles = {
        padding: "0px",
        borderRadius: "0px",
        boxShadow: "none",
        backgroundColor: "#ffffff",
    };

    const desktopStyles = {
        padding,
        borderRadius,
        boxShadow,
        backgroundColor: "#ffffff",
        marginBottom
    };

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    return (
        <div
            className={`w-full md:w-auto ${className}`}
            style={isMobile ? mobileStyles : desktopStyles}
        >
            {children}
        </div>
    );
};