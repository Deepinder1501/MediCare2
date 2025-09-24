import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "secret123"; 

// verify jwt
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; 
    next();
  });
}

router.get("/", authenticateToken, getProfile);

router.put("/", authenticateToken, updateProfile);

export default router;
