// Base URL for all auth-related API requests
const BASE_URL = "https://chatrooms-bspq.onrender.com";

/**
 * Creates a new user account
 * @param username - Desired username for the new user
 * @param password - Password for the new account
 * @param profilePicture - Optional profile picture URL
 * @returns The API response containing created user info
 * @throws Error if the request fails or API returns an error
 */
export const createUser = async (username: string, password: string, profilePicture?: string) => {
    const res = await fetch(`${BASE_URL}/auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, profilePicture }), // Send user info
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error creating account");

    return data;
};

/**
 * Logs in a user
 * @param username - User's username
 * @param password - User's password
 * @returns Object containing authentication token and user info
 * @throws Error if login fails
 */
export const loginUser = async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Send credentials
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");

    return data; // { token, user }
};

/**
 * Fetches the currently authenticated user's info
 * @param token - User's authentication token
 * @returns Current user's data
 * @throws Error if the request fails
 */
export const fetchCurrentUser = async (token: string) => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }, // Send auth token
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch user");

    return data.user;
};
