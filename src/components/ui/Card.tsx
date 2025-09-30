type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={`w-full rounded-2xl bg-slate-800/80 shadow-lg border border-slate-700 ${className || ""}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: CardProps) {
    return (
        <div
            className={`border-b border-slate-700 px-4 py-2 font-semibold text-white ${className || ""}`}
        >
            {children}
        </div>
    );
}

export function CardContent({ children, className }: CardProps) {
    return <div className={`p-4 text-gray-200 ${className || ""}`}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
    return (
        <div
            className={`border-t border-slate-700 px-4 py-2 text-sm text-gray-400 ${className || ""}`}
        >
            {children}
        </div>
    );
}
