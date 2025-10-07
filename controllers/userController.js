import { prisma } from "../prisma/prisma.js"

// Gets a user by ID
export const getUser = async (req, res) => {
    const { id } = req.params

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: { id: true, username: true, profilePicture: true }
        });
        if (!user) res.status(404).json({ error: "User not found" });
        res.json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error getting user" });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, profilePicture: true },
        });
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
}

export const updateProfilePic = async (req, res) => {
    const { id } = req.params
    const { profilePicture } = req.body;
    if (!profilePicture || typeof (profilePicture) != 'string') res.status(400).json({ error: "Must provide new profile picture in url string format" });
    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { profilePicture }
        })
        res.status(201).json({ success: true, user: updatedUser })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error updating profile picture" });
    }
}