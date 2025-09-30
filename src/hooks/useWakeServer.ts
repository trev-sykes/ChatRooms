import { useEffect, useState } from "react";

export function useWakeServer() {
    const [status, setStatus] = useState<null | boolean>(null); // null = unknown, true = healthy, false = unhealthy

    useEffect(() => {
        const lastPing = localStorage.getItem("lastHealthPing");
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000;

        // Only ping if 15+ mins have passed
        if (lastPing && now - parseInt(lastPing, 10) <= fifteenMinutes) {
            setStatus(true); // assume server already healthy
            return;
        }

        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const isDev = import.meta.env.DEV;
        console.log(`🟢 useWakeServer running in ${isDev ? "development" : "production"} mode`);
        console.log(`🌐 Pinging API at: ${apiUrl}/health`);

        let retries = 3;
        let delay = 1000; // start at 1s

        const pingServer = () => {
            fetch(`${apiUrl}/health`)
                .then(async (res) => {
                    try {
                        const data = await res.json();
                        console.log("Server health:", data);
                        localStorage.setItem("lastHealthPing", Date.now().toString());
                        setStatus(true);
                    } catch {
                        // Sometimes server returns HTML before fully awake
                        throw new Error("Invalid JSON response");
                    }
                })
                .catch((err) => {
                    console.warn(`Health check failed: ${err.message}`);
                    retries -= 1;
                    if (retries > 0) {
                        console.log(`Retrying in ${delay / 1000}s...`);
                        setTimeout(() => {
                            delay *= 2; // exponential backoff
                            pingServer();
                        }, delay);
                    } else {
                        console.error("Server unavailable after retries");
                        setStatus(false);
                    }
                });
        };

        pingServer();
    }, []);

    return status;
}
