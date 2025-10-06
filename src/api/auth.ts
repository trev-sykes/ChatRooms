// Use environment variable instead of hardcoded URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://chatrooms-bspq.onrender.com";

export const createUser = async (username: string, password: string, profilePicture?: string) => {
    const res = await fetch(`${BASE_URL}/auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, profilePicture }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error creating account");
    return data;
};

export const loginUser = async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
};

export const fetchCurrentUser = async (token: string) => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch user");
    return data.user;
};