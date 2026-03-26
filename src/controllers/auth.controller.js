import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import { success, error } from "../utils/response.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, "Username and password are required", 400);
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existing.rows.length > 0) {
      return error(res, "Username already taken", 409);
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, role, created_at",
      [username, hashed]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return success(res, { user, token }, "Registered successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, "Username and password are required", 400);
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return error(res, "Invalid credentials", 401);
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return error(res, "Invalid credentials", 401);
    }

    const token = generateToken(user);

    return success(res, {
      user: { id: user.id, username: user.username, role: user.role },
      token,
    }, "Login successful");
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, "User not found", 404);
    }

    return success(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
};