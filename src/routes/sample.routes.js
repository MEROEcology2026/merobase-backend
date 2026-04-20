import express from "express";
import {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
  deleteSample,
  searchSamples,
} from "../controllers/sample.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",          protect,              getAllSamples);
router.get("/search",    protect,              searchSamples);
router.get("/:id",       protect,              getSampleById);
router.post("/",         protect,              createSample);
router.put("/:id",       protect,              updateSample);
router.delete("/:id",    protect, requireAdmin, deleteSample); // ✅ admin only

export default router;