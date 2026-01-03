// src/server.ts - Unified server for Admin and User APIs
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

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
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

// =============================================
// SOCKET.IO - Real-time Chat
// =============================================

interface UserSocket {
  userId: number;
  userName: string;
  role: "CUSTOMER" | "ADMIN";
}

const onlineUsers = new Map<string, UserSocket>();

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // User joins (authenticate)
  socket.on("user:join", (userData: UserSocket) => {
    onlineUsers.set(socket.id, userData);
    console.log(`👤 User joined: ${userData.userName} (${userData.role})`);

    // If admin joins, send them list of active conversations
    if (userData.role === "ADMIN") {
      socket.emit("admin:online");
    }
  });

  // User sends message
  socket.on("message:send", async (data: {
    conversationId?: number;
    message: string;
    sender: "CUSTOMER" | "ADMIN";
  }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    try {
      // Save message to database
      const { ChatService } = await import("./services/admin/chatService");
      const savedMessage = await ChatService.saveMessage({
        conversationId: data.conversationId,
        userId: user.userId,
        message: data.message,
        sender: data.sender,
      });

      // Emit to all clients (both user and admin)
      io.emit("message:received", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("message:error", { error: "Failed to send message" });
    }
  });

  // Admin requests conversation list
  socket.on("admin:getConversations", async () => {
    try {
      const { ChatService } = await import("./services/admin/chatService");
      const conversations = await ChatService.getAllConversations();
      socket.emit("admin:conversationsList", conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  });

  // Get messages for a conversation
  socket.on("conversation:getMessages", async (conversationId: number) => {
    try {
      const { ChatService } = await import("./services/admin/chatService");
      const messages = await ChatService.getMessages(conversationId);
      socket.emit("conversation:messages", { conversationId, messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`👋 User left: ${user.userName}`);
      onlineUsers.delete(socket.id);
    }
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📦 Admin API: http://localhost:${port}/api/admin`);
  console.log(`👤 User API: http://localhost:${port}/api`);
  console.log(`💬 Socket.IO: WebSocket enabled`);
});
