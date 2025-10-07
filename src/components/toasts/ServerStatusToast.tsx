import React, { useState, useEffect, useRef } from "react";
import { Toast } from "../ui/Toast";

interface ServerStatusToastProps {
    status: null | boolean;
}

export const ServerStatusToast: React.FC<ServerStatusToastProps> = ({ status }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<{
        title: string;
        body: string;
        type: "info" | "success" | "warning" | "error"
    } | null>(null);
    const prevStatus = useRef<null | boolean>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // First render? Don't show anything yet.
        if (prevStatus.current === null && status === true) {
            prevStatus.current = status;
            return; // skip showing "Server Ready" on load if already healthy
        }

        if (status === null) {
            setMessage({
                title: "Server Waking Up",
                body: "The server is starting. Please wait a moment...",
                type: "info",
            });
            timeoutRef.current = setTimeout(() => setIsOpen(true), 3000);
        } else if (status === false) {
            setMessage({
                title: "Server Unavailable",
                body: "The server is currently unavailable. Some features may not work.",
                type: "error",
            });
            timeoutRef.current = setTimeout(() => setIsOpen(true), 3000);
        } else if (status === true && (prevStatus.current === null || prevStatus.current === false)) {
            // server just transitioned to healthy
            setMessage({
                title: "Server Ready",
                body: "✅ The server is now awake and ready to use.",
                type: "success",
            });
            timeoutRef.current = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
        } else {
            setIsOpen(false);
        }

        prevStatus.current = status;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [status]);

    if (!message) return null;

    return (
        <Toast
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={message.title}
            message={message.body}
            type={message.type}
            duration={message.type === "success" ? 3000 : 0} // Auto-close success, keep others open
            position="top-right"
        />
    );
};