import winston from "winston";
import server from "./server.js";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transports: [new winston.transports.Console()],
});

const PORT = process.env.PORT || 4000;

// Start the server
server.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});