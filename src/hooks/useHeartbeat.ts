import { useEffect } from "react";
import { useUser } from "../context/UserContext"; // or wherever your context is

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useHeartbeat = () => {
    const { token } = useUser();

    useEffect(() => {
        if (!token) return;

        const updateLastSeen = async () => {
            try {
                await fetch(`${BASE_URL}/users/last-seen`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (err) {
                console.error("Failed to update lastSeen:", err);
            }
        };

        // update immediately on mount
        updateLastSeen();

        const interval = setInterval(updateLastSeen, 60_000); // every 60 seconds
        return () => clearInterval(interval);
    }, [token]);
};
