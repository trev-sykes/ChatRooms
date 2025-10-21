import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma.js";
import { OAuth2Client } from "google-auth-library";


const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


export const setPassword = async (req, res) => {
    try {
        const userId = req.user.userId; // You’ll need auth middleware
        const { password } = req.body;

        if (!password || password.length < 6)
            return res.status(400).json({ error: "Password must be at least 6 characters" });

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.status(200).json({
            success: true,
            message: "Password set successfully",
            user: { id: updatedUser.id, username: updatedUser.username },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to set password" });
    }
};

export const linkGoogle = async (req, res) => {
    try {
        const userId = req.user.userId; // via authMiddleware
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ error: "Missing Google credential" });

        // Verify token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, sub: googleId } = payload;
        if (!email) return res.status(400).json({ error: "Google account has no email" });

        // Check if another user already linked this Google ID
        const existingUser = await prisma.user.findUnique({ where: { googleId } });
        if (existingUser) return res.status(400).json({ error: "This Google account is already linked to another user." });

        // Update current user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { googleId, email: email },
        });

        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to link Google account" });
    }
};


export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ error: "Missing Google credential" });

        // 1. Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        if (!email) return res.status(400).json({ error: "Google account has no email" });

        // 2. Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Auto-create a new user
            user = await prisma.user.create({
                data: {
                    email,
                    username: name || email.split("@")[0],
                    handle: name || email.split("@")[0],
                    googleId,
                    profilePicture: picture,
                },
            });
        }

        // 3. Issue your own JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Return JWT + user info
        res.json({
            success: true,
            token,
            needsPassword: user.password == null,
            user: {
                id: user.id,
                username: user.username,
                handle: user.handle,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                isDiscoverable: user.isDiscoverable,
                lastSeen: user.lastSeen,
                createdAt: user.createdAt
            },
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ error: "Google login failed" });
    }
};


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
                handle: username,
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
            token, // <--- add this
            user: {
                id: user.id,
                username: user.username,
                handle: user.handle,
                profilePicture: user.profilePicture,
                bio: user.bio ?? "",
                isDiscoverable: user.isDiscoverable ?? true,
                lastSeen: user.lastSeen,
                createdAt: user.createdAt,
                needsPassword: !user.password,
                needsGoogleLink: !user.googleId
            },
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
            user: {
                id: user.id,
                username: user.username,
                handle: user.handle,
                profilePicture: user.profilePicture,
                bio: user.bio ?? "",
                isDiscoverable: user.isDiscoverable ?? true,
                lastSeen: user.lastSeen,
                createdAt: user.createdAt,
                needsPassword: !user.password,
                needsGoogleLink: !user.googleId
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching user" });
    }
};
