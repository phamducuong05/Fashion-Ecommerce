// src/app.ts
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Đã đăng ký route này rồi thì KHÔNG CẦN LÀM GÌ THÊM
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
  console.log(`👉 Check products at: http://localhost:${PORT}/api/products`);
});
