import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface UseGoogleAuthReturn {
    loading: boolean;
    error: string | null;
    handleGoogleAuth: (credentialResponse: any) => Promise<void>;
}

export const useGoogleAuth = (redirectedRoute: string = "/home"): UseGoogleAuthReturn => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { loginWithGoogle, loadingUser } = useUser();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleAuth = useCallback(async (credentialResponse: any) => {
        setLoading(true);
        setError(null);

        try {
            const { credential } = credentialResponse;
            if (!credential) throw new Error("No credential received from Google");

            const res = await axios.post(
                `${apiUrl}/auth/google`,
                { credential },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            const { token, user } = res.data;
            if (!token) throw new Error("No token received from server");

            // Update context
            loginWithGoogle(token, user);

            // Wait until user context finishes loading
            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (!loadingUser) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 10);
            });

            navigate(redirectedRoute);
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Google authentication failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, loginWithGoogle, navigate, redirectedRoute, loadingUser]);

    return { loading, error, handleGoogleAuth };
};
