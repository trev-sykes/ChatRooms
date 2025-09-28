import React from "react";

interface CardProps {
    children: React.ReactNode;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    padding = "16px",
    borderRadius = "12px",
    boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)",
    className = "",
}) => {
    return (
        <div
            className={className}
            style={{
                padding,
                borderRadius,
                boxShadow,
                backgroundColor: "#ffffff",
            }}
        >
            {children}
        </div>
    );
};
