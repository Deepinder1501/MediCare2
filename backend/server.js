import express from "express";
import cors from "cors";
import db from "./config/mysql.js"; 
import authRoutes from "./routes/authRoutes.js"; 
import productRoutes from "./routes/productRoutes.js";
// import "./scheduler.js"; 
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contact.js";
import profileRoute from "./routes/profileRoutes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Medicine E-commerce Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth/profile", profileRoute);




const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
