import multer from "multer";
import { storage } from "../config/cloudinaryConfig.js";

// Initialize upload with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
});

export default upload;
