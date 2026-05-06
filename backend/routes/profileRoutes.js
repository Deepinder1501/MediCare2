import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "secret123"; // same as login/signup

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; // contains id and email
    next();
  });
}

// GET /api/auth/profile
router.get("/", authenticateToken, getProfile);

// PUT /api/auth/profile
router.put("/", authenticateToken, updateProfile);

export default router;
