// components/layout/PageWrapper.tsx
import React from "react";

interface PageWrapperProps {
    children: React.ReactNode;
    centered?: boolean;
    centeringOptions?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    centered = false,
    centeringOptions = false
}) => {
    return (
        <div className="flex flex-col w-full max-w-[1600px] mx-auto font-sans px-4 md:px-4 lg:px-4">
            {/* Main content */}
            <div
                className={`
                    ${centeringOptions ? "flex - 1 flex" : ""}
                    ${centered ? "items-start justify-center" : "items-start"}
                    ${centeringOptions ? "mt-4 md:mt-8" : ""}
                `}
            >
                {children}
            </div>
        </div >
    );
};
