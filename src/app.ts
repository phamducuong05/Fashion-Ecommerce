// src/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"; // Import Prisma
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// 1. Cấu hình
dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;

// 2. Khởi tạo Prisma Client (Kết nối DB)
export const prisma = new PrismaClient();

// 3. Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// 4. Route Test (Kiểm tra kết nối DB)
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    // Thử query đơn giản đếm số user
    const userCount = await prisma.user.count();
    res.status(200).json({
      status: "success",
      message: "Server is healthy! Database connected.",
      data: { userCount },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

// 5. Khởi động Server
app.listen(PORT, () => {
  console.log(`------------------------------------------------`);
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`------------------------------------------------`);
});
