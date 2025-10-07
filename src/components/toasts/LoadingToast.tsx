import React from "react";
import { Toast } from "../ui/Toast";

interface LoadingToastProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export const LoadingToast: React.FC<LoadingToastProps> = ({
    isOpen,
    onClose,
    title = "Still waking up…",
    message = "⏳ The servers are taking a bit longer than usual. Please hang tight!",
}) => {
    return (
        <Toast
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            message={message}
            type="info"
            duration={0} // persistent
            position="top-center"
        />
    );
};
