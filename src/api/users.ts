const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Updates the user's profile picture
 * @param userId - The ID of the user
 * @param token - Auth token for the user
 * @param profilePictureUrl - URL of the new profile picture
 * @throws Error if the request fails
 */
export const updateUserAvatar = async (
    userId: number,
    token: string,
    profilePictureUrl: string
) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/profile-picture`, {
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
