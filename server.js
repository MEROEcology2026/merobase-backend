import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./src/middleware/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import sampleRoutes from "./src/routes/sample.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/samples", sampleRoutes);
app.use("/api/upload", uploadRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ status: "MeroBase API is running" });
});

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});