// components/layout/PageWrapper.tsx
import React from "react";
import { Logo } from "../Logo";

interface PageWrapperProps {
    children: React.ReactNode;
    centered?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    centered = false,
}) => {
    return (
        <div
            className={`
                flex flex-col min-h-screen w-full max-w-[1600px]
                px-4 mx-auto font-sans
            `}
        >
            {/* Keep logo at the top */}
            <div className="py-6 mx-auto w-64">
                <Logo />
            </div>

            {/* Main content */}
            <div
                className={`
                    flex-1 flex
                    ${centered ? "items-start justify-center" : "items-start"}
                    mt-8
                `}
            >
                {children}
            </div>
        </div>
    );
};
