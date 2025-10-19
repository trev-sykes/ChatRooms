import "./config.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import conversationRoutes from "./routes/conversation.js";
import userRoutes from "./routes/user.js";
import healthRoutes from "./routes/health.js";

const app = express();

// Allow requests from production and local dev environments
app.use(cors({
    origin: [
        "https://chat-rooms-chi.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}));

// Parse incoming JSON payloads
app.use(express.json());

// API routes
app.use("/auth", authRoutes);
app.use("/", messageRoutes);
app.use("/conversations", conversationRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);

export default app;