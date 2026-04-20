import jwt from "jsonwebtoken";
import { error } from "../utils/response.js";
import pool from "../db/index.js";

/* ================= PROTECT ================= */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Not authorized. No token provided.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    /* ✅ Stamp last_active_at — fire and forget, does not block request */
    pool.query(
      "UPDATE users SET last_active_at = NOW() WHERE id = $1",
      [decoded.id]
    ).catch(() => {});

    next();
  } catch (err) {
    return error(res, "Not authorized. Invalid token.", 401);
  }
};

/* ================= REQUIRE ADMIN ================= */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return error(res, "Not authorized. Admin access required.", 403);
  }
  next();
};