import { useState, useEffect, useRef } from "react";

interface LoadingToastControl {
    isOpen: boolean;
    start: () => void;
    stop: () => void;
    message: { title: string; body: string };
}

/**
 * Hook for controlling a loading toast that appears
 * if an async action takes too long (e.g. server startup).
 */
export const useLoadingToast = (
    delay: number = 6000 // show toast after 6 seconds
): LoadingToastControl => {
    const [isOpen, setIsOpen] = useState(false);
    const [message] = useState({
        title: "Still waking up…",
        body: "⏳ The servers are taking a bit longer than usual. Please hang tight!",
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsOpen(true), delay);
    };

    const stop = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsOpen(false);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { isOpen, start, stop, message };
};
