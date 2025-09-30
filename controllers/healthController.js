import { prisma } from "../prisma/prisma.js";

export const getHealth = async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.status(200).json({ status: "Healthy" });
    } catch (error) {
        console.error("Health check failed:", error);
        return res.status(503).json({
            status: "Unhealthy",
            error: error.message,
        });
    }
};
