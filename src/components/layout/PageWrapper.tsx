// components/layout/PageWrapper.tsx
import React from "react";
import { Logo } from "../Logo";

interface PageWrapperProps {
    children: React.ReactNode;
    centered?: boolean;
    maxWidth?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
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
        font-sans
      `}
        >
            <Logo />
            {children}
        </div>
    );
};