import { useState, useEffect } from "react";
import { fetchCurrentUser, linkGoogleApi } from "../api/auth";
import { useUser } from "../context/UserContext";

export const useAuthFlows = () => {
    const { user, token, setUser } = useUser();

    // ---- Password Modal ----
    const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // ---- Google Link Modal ----
    const [isLinkGoogleOpen, setIsLinkGoogleOpen] = useState(false);
    const [loadingLink, setLoadingLink] = useState(false);

    // Auto-open password modal if required
    useEffect(() => {
        if (user?.needsPassword) setIsSetPasswordOpen(true);
        else setIsSetPasswordOpen(false);
    }, [user]);

    // Auto-open Google modal if required
    useEffect(() => {
        if (user?.needsGoogleLink) setIsLinkGoogleOpen(true);
        else setIsLinkGoogleOpen(false);
    }, [user]);

    // ---- Password Handler ----
    const handleSetPassword = async () => {
        if (!token) return;

        if (!newPassword || newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        try {
            setPasswordLoading(true);
            setPasswordError(null);

            await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const updatedUser = await fetchCurrentUser(token);
            setUser(updatedUser);

            setIsSetPasswordOpen(false);
            setNewPassword("");
        } catch (err: any) {
            setPasswordError(err.message || "Failed to set password");
        } finally {
            setPasswordLoading(false);
        }
    };

    // ---- Google OAuth Handler ----
    const handleLinkGoogle = async (credentialResponse: any) => {
        if (!token) return;

        try {
            setLoadingLink(true);
            const { credential } = credentialResponse;
            if (!credential) throw new Error("No credential from Google");

            await linkGoogleApi(token, credential);

            const updatedUser = await fetchCurrentUser(token);
            setUser(updatedUser);

            setIsLinkGoogleOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingLink(false);
        }
    };

    return {
        // Password modal
        isSetPasswordOpen,
        setIsSetPasswordOpen,
        newPassword,
        setNewPassword,
        passwordError,
        passwordLoading,
        handleSetPassword,

        // Google modal
        isLinkGoogleOpen,
        setIsLinkGoogleOpen,
        loadingLink,
        handleLinkGoogle,
    };
};
