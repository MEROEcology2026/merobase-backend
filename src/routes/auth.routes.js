import express from "express";
import { register, login, getMe, getActiveUsers } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/active-users", protect, getActiveUsers); // ✅ NEW

export default router;