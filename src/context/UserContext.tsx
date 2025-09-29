import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, fetchCurrentUser } from "../api/auth";
import { updateUserAvatar } from "../api/users";
import { getAvatarUrl } from "../utils/avatars";


/**
 * Type representing a user object or null if not authenticated
 */
type User = {
    id: number;
    username: string;
    profilePicture: string;
} | null;

/**
 * Context interface for user authentication state and actions
 */
interface UserContextProps {
    user: User; // Current authenticated user
    setUser: React.Dispatch<React.SetStateAction<User>>; // Setter for user state
    token: string | null; // Current auth token
    setToken: React.Dispatch<React.SetStateAction<string | null>>; // Setter for token state
    login: (username: string, password: string) => Promise<void>; // Function to log in a user
    logout: () => void; // Function to log out the current user
    updateAvatar: (customUrl?: string, style?: string) => Promise<void>; // <-- fix here
}

/**
 * React context for user authentication
 */
const UserContext = createContext<UserContextProps | undefined>(undefined);

/**
 * Provides user authentication state and functions to children components
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
    // State for currently authenticated user
    const [user, setUser] = useState<User>(null);

    // State for auth token, initialized from localStorage if available
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    /**
     * Fetch the current user when a token exists on app load
     * Updates user state or clears it if token is invalid/expired
     */
    useEffect(() => {
        if (!token) return;

        fetchCurrentUser(token)
            .then(user => setUser(user)) // Set authenticated user
            .catch(() => {
                // Token invalid or fetch failed, clear state and localStorage
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");
            });
    }, [token]);

    /**
     * Logs in a user using the API and updates context state
     * @param username - user's username
     * @param password - user's password
     * @throws Error if login fails
     */
    const login = async (username: string, password: string) => {
        const data = await loginUser(username, password);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    /**
     * Logs out the current user and clears authentication state
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };


    // -------------------------------
    // New: updateAvatar handler
    // -------------------------------
    const updateAvatar = async (customUrl?: string, style: string = "adventurer") => {
        if (!user || !token) return;

        const avatarToUse = getAvatarUrl(customUrl, style);

        // Optimistic update
        setUser({ ...user, profilePicture: avatarToUse });

        try {
            await updateUserAvatar(user.id, token, avatarToUse);
            // No need to do anything, user already updated optimistically
        } catch (err) {
            console.error("Error updating avatar:", err);
            // Rollback on failure
            fetchCurrentUser(token).then(freshUser => setUser(freshUser)).catch(() => setUser(null));
        }
    };



    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, login, logout, updateAvatar }}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * Custom hook to access the UserContext
 * @throws Error if used outside of UserProvider
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
