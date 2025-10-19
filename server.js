import http from "http";
import app from "./app.js";
import { initializeWebSocket } from "./websocket/index.js";

// Create HTTP server with Express app
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
// This allows both HTTP and WebSocket to share the same port
initializeWebSocket(server);

export default server;