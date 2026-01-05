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
import chatbotRoutes from "./routes/user/chatbotRoutes";

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
app.use(express.static("public")); // Serve static files for testing

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
app.use("/api/chat", chatbotRoutes);

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
    console.log(`👤 User joined: ${userData.userName} (${userData.role}) - Socket ID: ${socket.id} - User ID: ${userData.userId}`);

    // If admin joins, send them list of active conversations
    if (userData.role === "ADMIN") {
      socket.emit("admin:online");
      console.log("✅ Admin marked as online");
    }
  });

  // User sends message
  socket.on("message:send", async (data: {
    conversationId?: number;
    message: string;
    sender: "CUSTOMER" | "ADMIN";
  }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) {
      console.error("❌ User not found in onlineUsers map for socket:", socket.id);
      socket.emit("message:error", { error: "User not authenticated. Please reconnect." });
      return;
    }

    console.log("📨 Message received from:", user.userName, "Data:", data);

    try {
      // Save message to database
      const { ChatService } = await import("./services/admin/chatService");
      const savedMessage = await ChatService.saveMessage({
        conversationId: data.conversationId,
        userId: user.userId,
        message: data.message,
        sender: data.sender,
      });

      console.log("✅ Message saved to database:", savedMessage.id);

      // Emit to all clients (both user and admin)
      io.emit("message:received", savedMessage);
      console.log("📤 Message broadcasted to all clients");
    } catch (error) {
      console.error("❌ Error saving message:", error);
      socket.emit("message:error", { 
        error: error instanceof Error ? error.message : "Failed to send message" 
      });
    }
  });

  // Admin requests conversation list
  socket.on("admin:getConversations", async () => {
    console.log("📋 Admin requesting conversations list");
    try {
      const { ChatService } = await import("./services/admin/chatService");
      const conversations = await ChatService.getAllConversations();
      console.log(`✅ Sending ${conversations.length} conversations to admin`);
      socket.emit("admin:conversationsList", conversations);
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
    }
  });

  // Get messages for a conversation
  socket.on("conversation:getMessages", async (conversationId: number) => {
    console.log("💬 Requesting messages for conversation:", conversationId);
    try {
      const { ChatService } = await import("./services/admin/chatService");
      const messages = await ChatService.getMessages(conversationId);
      console.log(`✅ Sending ${messages.length} messages for conversation ${conversationId}`);
      socket.emit("conversation:messages", { conversationId, messages });
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  });

  // Mark conversation as read (when admin opens it)
  socket.on("conversation:markAsRead", async (conversationId: number) => {
    console.log("✅ Marking conversation as read:", conversationId);
    try {
      const { ChatService } = await import("./services/admin/chatService");
      await ChatService.markConversationAsRead(conversationId);
      console.log(`✅ Conversation ${conversationId} marked as read`);
      
      // Broadcast updated conversations to all admins
      const conversations = await ChatService.getAllConversations();
      io.emit("admin:conversationsList", conversations);
    } catch (error) {
      console.error("❌ Error marking conversation as read:", error);
    }
  });

  // Customer requests their own conversation
  socket.on("customer:getMyConversation", async () => {
    const user = onlineUsers.get(socket.id);
    if (!user) {
      console.error("❌ User not authenticated");
      return;
    }

    console.log("🔍 Customer requesting their conversation:", user.userId);
    try {
      const { ChatService } = await import("./services/admin/chatService");
      const conversation = await ChatService.getOrCreateConversation(user.userId);
      const messages = await ChatService.getMessages(conversation.id);
      
      console.log(`✅ Sending conversation ${conversation.id} with ${messages.length} messages to customer`);
      socket.emit("customer:myConversation", {
        conversation,
        messages,
      });
    } catch (error) {
      console.error("❌ Error fetching customer conversation:", error);
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
