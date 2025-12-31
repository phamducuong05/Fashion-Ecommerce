import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
