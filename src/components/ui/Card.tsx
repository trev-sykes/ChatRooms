import React from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

// ✅ forwardRef lets parent components attach refs to this div
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className }, ref) => {
        return (
            <div
                ref={ref}
                className={`w-full mx-auto rounded-xl max-sm:rounded-lg bg-slate-800/80 shadow-md max-sm:shadow-sm border border-slate-700 mb-5 ${className || ""}`}
            >
                {children}
            </div>
        );
    }
);
// ✅ Optional: give the component a display name (helps with dev tools)
Card.displayName = "Card";
export function CardHeader({ children, className }: CardProps) {
    return (
        <div
            className={`border-b border-slate-700 px-3 py-1.5 max-sm:px-2 max-sm:py-1 font-semibold text-base text-white ${className || ""}`}
        >
            {children}
        </div>
    );
}

export function CardContent({ children, className }: CardProps) {
    return (
        <div
            className={`p-3 max-sm:p-2 text-base text-gray-200 ${className || ""}`}
        >
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: CardProps) {
    return (
        <div
            className={`border-t border-slate-700 px-3 py-1.5 max-sm:px-2 max-sm:py-1 text-sm text-gray-400 ${className || ""}`}
        >
            {children}
        </div>
    );
}