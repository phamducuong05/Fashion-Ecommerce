// src/server.ts - Unified server for Admin and User APIs
import "dotenv/config";
import express from "express";
import cors from "cors";

// Admin routes
import adminRoutes from "./routes/admin";

// User routes
import productRoutes from "./routes/user/productRoutes";
import categoryRoutes from "./routes/user/categoryRoutes";
import authRoutes from "./routes/user/authRoutes";
import cartRoutes from "./routes/user/cartRoutes";
import userRoutes from "./routes/user/userRoutes";
import addressRoutes from "./routes/user/addressRoutes";
import orderRoutes from "./routes/user/orderRoutes";
import voucherRoutes from "./routes/user/voucherRoutes";
import paymentRoutes from "./routes/user/paymentRoutes";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// =============================================
// ADMIN API ROUTES - /api/admin/*
// =============================================
app.use("/api/admin", adminRoutes);

// =============================================
// USER API ROUTES - /api/*
// =============================================
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/payment", paymentRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "Fashion Ecommerce API Server",
    endpoints: {
      admin: "/api/admin/*",
      user: "/api/*",
    },
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📦 Admin API: http://localhost:${port}/api/admin`);
  console.log(`👤 User API: http://localhost:${port}/api`);
});
