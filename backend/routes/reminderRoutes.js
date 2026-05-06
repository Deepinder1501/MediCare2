import express from "express";
import { getReminders, addReminder, updateReminder, deleteReminder } from "../controllers/reminderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All reminder routes require authentication
router.use(verifyToken);

router.get("/:userId", getReminders);
router.post("/", addReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

export default router;
