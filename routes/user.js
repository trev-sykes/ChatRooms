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
userRoutes.patch("/profile-picture", authMiddleware, userController.updateProfilePic);
// Updates a user profile
userRoutes.put("/profile", authMiddleware, userController.updateProfile);

// Updates the last seen for a user
userRoutes.patch("/last-seen", authMiddleware, userController.updateLastSeen);
export default userRoutes