// src/routes/adminChatRoutes.ts
import { Router } from "express";
import {
  getChatMessages,
  replyToChat,
  markChatAsRead,
} from "../controllers/adminChatController";

const router = Router();

// GET /api/admin/chatmessages - Get all chat conversations
router.get("/", getChatMessages);

// PUT /api/admin/chatmessages/:id - Send admin reply
router.put("/:id", replyToChat);

// PUT /api/admin/chatmessages/:id/read - Mark conversation as read
router.put("/:id/read", markChatAsRead);

export default router;
