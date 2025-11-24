import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Cấu hình Cloudinary với thông tin từ .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// 2. Cấu hình nơi lưu trữ (Storage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "express-ecommerce-project", // Tên thư mục sẽ tạo trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Chỉ cho phép ảnh
    // transformation: [{ width: 500, height: 500, crop: 'limit' }], // (Tùy chọn) Tự động resize ảnh nếu cần
  } as any, // 'as any' để tránh lỗi type khó chịu của thư viện này
});

// 3. Khởi tạo instance Multer
const upload = multer({ storage: storage });

export default upload;
