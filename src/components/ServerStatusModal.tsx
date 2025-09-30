import React, { useState, useEffect } from "react";
import { Modal } from "./modal/Modal";

interface ServerStatusModalProps {
    status: null | boolean;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({ status }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Only open modal if server is waking up or down
        if (status === null || status === false) {
            setIsOpen(true);
        } else {
            setIsOpen(false); // auto-close if healthy
        }
    }, [status]);

    let title = "";
    let message = "";

    if (status === null) {
        title = "Server Waking Up";
        message = "⏳ The server is starting. Please wait a moment...";
    } else if (status === false) {
        title = "Server Unavailable";
        message = "🚨 The server is currently unavailable. Some features may not work.";
    } else {
        return null; // healthy, don't render modal
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={title}
        >
            <p className="text-gray-100">{message}</p>
        </Modal>
    );
};
