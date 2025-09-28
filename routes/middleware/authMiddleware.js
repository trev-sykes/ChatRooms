import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Invalid token format" });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
