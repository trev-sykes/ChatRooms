import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = {
    id: number;
    username: string;
    profilePicture: string;
} | null;

interface UserContextProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    // Fetch current user on app load if token exists
    useEffect(() => {
        console.log("UserProvider useEffect triggered, token:", token); // ✅ log token
        if (!token) return;

        fetch("http://localhost:4000/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log("Response status from /auth/me:", res.status); // ✅ log status
                return res.json();
            })
            .then(data => {
                console.log("/auth/me response data:", data); // ✅ log returned data
                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem("token");
                }
            })
            .catch(err => {
                console.error("Error fetching /auth/me:", err); // ✅ log errors
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");
            });
    }, [token]);


    // Login function
    const login = async (username: string, password: string) => {
        const res = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok && data.token) {
            setToken(data.token);
            localStorage.setItem("token", data.token);
            setUser(data.user);
        } else {
            throw new Error(data.error || "Login failed");
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
