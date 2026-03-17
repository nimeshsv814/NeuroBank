import express from "express";
import {
  createTransition,
  getTransitions,
} from "../controllers/transition.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createTransition", authMiddleware, createTransition);
router.get("/history/:accountId", authMiddleware, getTransitions);

export default router;
