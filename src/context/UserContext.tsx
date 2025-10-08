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
    bio?: string;
    isDiscoverable: boolean;
    lastSeen: any;
} | null;

/**
 * Context interface for user authentication state and actions
 */
interface UserContextProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (username: string, password: string) => Promise<void>;
    loginWithGoogle: (token: string, user: User) => void; // NEW: Direct login with token
    logout: () => void;
    updateAvatar: (customUrl?: string, style?: string) => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        if (!token) return;

        fetchCurrentUser(token)
            .then(user => setUser(user))
            .catch(() => {
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");
            });
    }, [token]);

    /**
     * Regular username/password login
     */
    const login = async (username: string, password: string) => {
        const data = await loginUser(username, password);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    /**
     * NEW: Google OAuth login - directly sets token and user from backend response
     */
    const loginWithGoogle = (authToken: string, userData: User) => {
        setToken(authToken);
        localStorage.setItem("token", authToken);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    const updateAvatar = async (customUrl?: string, style: string = "adventurer") => {
        if (!user || !token) return;

        const avatarToUse = getAvatarUrl(customUrl, style);
        setUser({ ...user, profilePicture: avatarToUse });

        try {
            await updateUserAvatar(token, avatarToUse);
        } catch (err) {
            console.error("Error updating avatar:", err);
            fetchCurrentUser(token).then(freshUser => setUser(freshUser)).catch(() => setUser(null));
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, login, loginWithGoogle, logout, updateAvatar }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};