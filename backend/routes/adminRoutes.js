import express from "express";
import {
  getAllUsers,
  deleteUser,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts  
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/products", getAllProducts); 
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;




