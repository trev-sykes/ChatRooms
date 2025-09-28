import { Router } from "express";
import * as authController from "../controllers/authController.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = new Router();

// Public routes
router.post("/create", authController.signup);
router.post("/login", authController.login);

// Protected route
router.get("/me", authMiddleware, authController.me);

export default router;
