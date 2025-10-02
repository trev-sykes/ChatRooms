import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./modal/Modal";

interface ServerStatusModalProps {
    status: null | boolean;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({ status }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<{ title: string; body: string } | null>(null);
    const prevStatus = useRef<null | boolean>(null);

    useEffect(() => {
        if (status === null) {
            setIsOpen(true);
            setMessage({
                title: "Server Waking Up",
                body: "⏳ The server is starting. Please wait a moment...",
            });
        } else if (status === false) {
            setIsOpen(true);
            setMessage({
                title: "Server Unavailable",
                body: "🚨 The server is currently unavailable. Some features may not work.",
            });
        } else if (status === true && (prevStatus.current === null || prevStatus.current === false)) {
            // server just transitioned to healthy
            setIsOpen(true);
            setMessage({
                title: "Server Ready",
                body: "✅ The server is now awake and ready to use.",
            });

            // Auto-close after a few seconds
            setTimeout(() => setIsOpen(false), 2500);
        } else {
            setIsOpen(false);
        }

        prevStatus.current = status;
    }, [status]);

    if (!message) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={message.title}
        >
            <p className="text-gray-100">{message.body}</p>
        </Modal>
    );
};
