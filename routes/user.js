import { Router } from "express";
import authMiddleware from "./middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

// Create a user route
const userRoutes = new Router();

// Gets all users
userRoutes.get("/", authMiddleware, userController.getUsers);

// Gets a user by their ID
userRoutes.get("/:id", authMiddleware, userController.getUser);

//Updates a users profile picture
userRoutes.patch("/:id/profile-picture", authMiddleware, userController.updateProfilePic);

export default userRoutes