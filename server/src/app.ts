// src/app.ts
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";
import cartRoutes from "./routes/cart.routes";
import userRoutes from "./routes/user.routes";
import addressRoutes from "./routes/address.routes";
import orderRoutes from "./routes/order.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
  console.log(`👉 Check products at: http://localhost:${PORT}/api/products`);
});
