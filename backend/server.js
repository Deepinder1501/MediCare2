import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/mysql.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import "./scheduler.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contact.js";
import profileRoute from "./routes/profileRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const allowedOrigins = [
  "https://medicare2-black.vercel.app",
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean); // Remove undefined/null values

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedAllowed = allowedOrigins.map(o => o?.replace(/\/$/, ""));

    if (normalizedAllowed.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      console.log("🚫 CORS Blocked Origin:", origin); // This will show in Render logs
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Medicine E-commerce Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth/profile", profileRoute);
app.use("/api/reminders", reminderRoutes);
app.use("/api/orders", orderRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
