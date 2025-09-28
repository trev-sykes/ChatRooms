// components/layout/PageWrapper.tsx
import React from "react";

interface PageWrapperProps {
    children: React.ReactNode;
    bgColor?: string;      // optional background
    centered?: boolean;    // flex center vertically & horizontally
    maxWidth?: string;     // max width of content
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    bgColor = "bg-gray-50",
    centered = false,
    maxWidth = "max-w-[1600px]",
}) => {
    return (
        <div
            className={`
                flex flex-col
                ${centered ? "items-center justify-center" : "items-start justify-start"}
                min-h-screen w-full
                ${maxWidth} mx-auto
                ${bgColor}
                font-sans
            `}
        >
            {children}
        </div>
    );
};
