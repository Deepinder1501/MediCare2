import express from "express";
import {
  getAllUsers,
  deleteUser,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts  
} from "../controllers/adminController.js";
import upload from "../middleware/uploadMiddleware.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply security to all admin routes
router.use(verifyToken, isAdmin);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Products
router.get("/products", getAllProducts);
router.post("/products", upload.single("image"), addProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;




