import { Router } from "express";
import * as healthController from "../controllers/healthController.js"

const healthRoutes = Router();

healthRoutes.get("/", healthController.getHealth)

export default healthRoutes;