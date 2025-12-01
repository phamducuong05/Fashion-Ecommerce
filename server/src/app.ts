// src/app.ts
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import adminDashboardRoutes from "./routes/adminDashboardRoutes";
import adminProductRoutes from "./routes/adminProductRoutes";
import adminOrderRoutes from "./routes/adminOrderRoutes";
import adminCustomerRoutes from "./routes/adminCustomerRoutes";
import adminDiscountRoutes from "./routes/adminDiscountRoutes";
import adminChatRoutes from "./routes/adminChatRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Public API routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// Admin Panel API routes
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/discounts", adminDiscountRoutes);
app.use("/api/admin/chatmessages", adminChatRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
  console.log(`\n� Public API:`);
  console.log(`   GET http://localhost:${PORT}/api/products`);
  console.log(`   GET http://localhost:${PORT}/api/categories`);
  console.log(`\n� Admin API:`);
  console.log(`   GET    http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`   GET    http://localhost:${PORT}/api/admin/products`);
  console.log(`   POST   http://localhost:${PORT}/api/admin/products`);
  console.log(`   PUT    http://localhost:${PORT}/api/admin/products/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/admin/products/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/admin/orders`);
  console.log(`   PUT    http://localhost:${PORT}/api/admin/orders/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/admin/customers`);
  console.log(`   GET    http://localhost:${PORT}/api/admin/discounts`);
  console.log(`   POST   http://localhost:${PORT}/api/admin/discounts`);
  console.log(`   PUT    http://localhost:${PORT}/api/admin/discounts/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/admin/discounts/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/admin/chatmessages`);
  console.log(`   PUT    http://localhost:${PORT}/api/admin/chatmessages/:id`);
});
