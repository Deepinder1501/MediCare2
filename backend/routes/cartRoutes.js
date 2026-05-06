import express from "express";
import { addToCart, getCart, updateCartQuantity, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);

router.get("/:userId", getCart);

router.put("/update/:cartId", updateCartQuantity);

router.delete("/remove/:cartId", removeFromCart);

export default router;
