import React, { useEffect, useState } from "react";

interface ToastProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
    duration?: number;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export const Toast: React.FC<ToastProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    duration = 5000,
    position = "top-right",
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsExiting(false);

            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);

                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            onClose();
        }, 300);
    };

    if (!isVisible && !isOpen) return null;

    const typeStyles = {
        info: "bg-blue-600 border-blue-500",
        success: "bg-green-600 border-green-500",
        warning: "bg-yellow-600 border-yellow-500",
        error: "bg-red-600 border-red-500",
    };

    const typeIcons = {
        info: "ℹ️",
        success: "✅",
        warning: "⚠️",
        error: "🚨",
    };

    const positionStyles = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    };

    const animationStyles = position.includes("right")
        ? isExiting
            ? "translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        : position.includes("left")
            ? isExiting
                ? "-translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            : isExiting
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100";

    return (
        <div
            className={`fixed ${positionStyles[position]} z-50 transition-all duration-300 ease-in-out ${animationStyles}`}
            style={{ maxWidth: "90vw", width: "400px" }}
        >
            <div
                className={`${typeStyles[type]} rounded-lg shadow-lg border-l-4 p-4 text-white`}
                role="alert"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl flex-shrink-0" aria-hidden="true">
                            {typeIcons[type]}
                        </span>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">{title}</h3>
                            <p className="text-sm text-gray-100 break-words">{message}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                        aria-label="Close notification"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};