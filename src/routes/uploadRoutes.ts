import { Router } from "express";
import upload from "../config/cloudinary"; // Import cấu hình multer
import { uploadImage } from "../controllers/uploadController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// API: POST /api/upload
// Middleware 'authenticate': Phải đăng nhập mới được up ảnh
// Middleware 'upload.single("image")': Chỉ nhận 1 file, field name là "image"
router.post("/", authenticate, upload.single("image"), uploadImage);

export default router;
