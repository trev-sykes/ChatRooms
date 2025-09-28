import "./config.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import conversationRoutes from "./routes/conversation.js";
import userRoutes from "./routes/user.js";

// Create our server instance
const app = express();

app.use(cors({
    origin: [
        "https://chat-rooms-chi.vercel.app", // no trailing slash
        "http://localhost:5173" // for local dev if needed
    ]
}));


// Auto parse json
app.use(express.json());

// Port
const PORT = process.env.PORT || 4000;
// Mount auth routes
app.use("/auth", authRoutes);

// Mount message routes
app.use("/", messageRoutes);

// Mount conversation routes
app.use("/conversations", conversationRoutes);

//Mount user routes
app.use("/users", userRoutes);


// Listen for calls
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));
