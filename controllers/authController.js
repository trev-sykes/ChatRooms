import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    const { username, password, profilePicture } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Username and password required" });

    const defaultProfilePicture = `https://i.pravatar.cc/100?u=${username}`;

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                profilePicture: profilePicture || defaultProfilePicture,
            },
        });

        res.status(201).json({
            status: "User Created",
            user: { id: newUser.id, username: newUser.username, profilePicture: newUser.profilePicture },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating user" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Username and password required" });

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, username: user.username, profilePicture: user.profilePicture },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login error" });
    }
};

export const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            success: true,
            user: { id: user.id, username: user.username, profilePicture: user.profilePicture },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching user" });
    }
};
