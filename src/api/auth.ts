// Use environment variable instead of hardcoded URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://chatrooms-bspq.onrender.com";

export const createUser = async (username: string, password: string, profilePicture: string = `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 10000)}`) => {
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

export const setPasswordApi = async (token: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/set-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // auth middleware required
        },
        body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to set password");
    return data;
};
export const linkGoogleApi = async (token: string, credential: string) => {
    const res = await fetch(`${BASE_URL}/auth/link-google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ credential }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to link Google account");
    return data;
};
