import { prisma } from "../prisma/prisma.js"

// Gets a user by ID
export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                username: true,
                profilePicture: true,
                bio: true,
                lastSeen: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Error getting user" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const searchTerm = req.query.search || "";

        const users = await prisma.user.findMany({
            where: {
                isDiscoverable: true,
                username: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                username: true,
                profilePicture: true,
                bio: true,
                lastSeen: true,
                createdAt: true,
            },
            orderBy: {
                username: "asc",
            },
        });

        res.json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const updateProfilePic = async (req, res) => {
    const userId = req.user.userId; // get from auth middleware
    const { profilePicture } = req.body;

    if (!profilePicture || typeof profilePicture !== "string") {
        return res.status(400).json({
            error: "Must provide new profile picture in URL string format",
        });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profilePicture },
            select: { id: true, username: true, profilePicture: true },
        });

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ error: "Error updating profile picture" });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.user.userId; // get from auth middleware
    const { bio, isDiscoverable } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(bio !== undefined && { bio }),
                ...(isDiscoverable !== undefined && { isDiscoverable }),
            },
            select: {
                id: true,
                username: true,
                bio: true,
                isDiscoverable: true,
                profilePicture: true,
            },
        });

        res.json({ user: updatedUser });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const updateLastSeen = async (req, res) => {
    const userId = req.user.userId; // get from auth middleware
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { lastSeen: new Date() },
            select: { id: true, lastSeen: true, isOnline: true },
        });
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update lastSeen" });
    }
};