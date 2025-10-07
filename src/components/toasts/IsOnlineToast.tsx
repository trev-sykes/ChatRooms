import React, { useState, useEffect, useRef } from "react";
import { Toast } from "../ui/Toast";
import { useOnline } from "../../hooks/useOnline";

export const IsOnlineToast: React.FC = () => {
    const isOnline = useOnline();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<{
        title: string;
        body: string;
        type: "info" | "success" | "warning" | "error";
    } | null>(null);

    const prevStatus = useRef<boolean | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Skip initial render if online
        if (prevStatus.current === null && isOnline === true) {
            prevStatus.current = isOnline;
            return;
        }

        if (isOnline === false) {
            setMessage({
                title: "You’re Offline",
                body: "No internet connection. Some features may not work.",
                type: "warning",
            });
            setIsOpen(true);
        } else if (isOnline === true && prevStatus.current === false) {
            setMessage({
                title: "Back Online",
                body: "✅ Connection restored. You’re back online.",
                type: "success",
            });
            timeoutRef.current = setTimeout(() => setIsOpen(true), 300);
        }

        prevStatus.current = isOnline;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isOnline]);

    if (!message) return null;

    return (
        <Toast
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={message.title}
            message={message.body}
            type={message.type}
            duration={message.type === "success" ? 3000 : 0} // auto-close success
            position="top-left"
        />
    );
};
