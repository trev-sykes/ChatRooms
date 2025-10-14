const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Updates the user's profile picture
 * @param userId - The ID of the user
 * @param token - Auth token for the user
 * @param profilePictureUrl - URL of the new profile picture
 * @throws Error if the request fails
 */
export const updateUserAvatar = async (
    token: string,
    profilePictureUrl: string
) => {
    const res = await fetch(`${BASE_URL}/users/profile-picture`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePicture: profilePictureUrl }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update avatar");

    return data;
};

export async function updateProfile(token: string, updates: { bio?: string; isDiscoverable?: boolean }) {
    const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    return data.user;
}

export const fetchUser = async (token: any, userId: number) => {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");
    return data.user;
}
/**
 * Fetch all users in the system
 * @param token - Auth token
 * @returns Array of users with id, username, and optional profilePicture
 */
export const fetchAllUsers = async (token: string) => {
    const res = await fetch(`${BASE_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");

    return data.users; // should return [{ id, username, profilePicture }, ...]
};

