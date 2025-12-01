// src/controllers/adminChatController.ts
import { Request, Response } from "express";
import {
  getAllChatConversations,
  sendAdminMessage,
  markAsRead,
} from "../services/adminChatService";

// GET /api/admin/chatmessages
export async function getChatMessages(req: Request, res: Response) {
  try {
    const conversations = await getAllChatConversations();
    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat messages",
    });
  }
}

// PUT /api/admin/chatmessages/:id - Send admin reply
export async function replyToChat(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
      return;
    }

    const { text } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        message: "Message text is required",
      });
      return;
    }

    const message = await sendAdminMessage(id, text);

    res.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error("Error sending chat message:", error);

    if (error.message === "Conversation not found") {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
}

// PUT /api/admin/chatmessages/:id/read - Mark as read
export async function markChatAsRead(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
      return;
    }

    const result = await markAsRead(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error marking chat as read:", error);

    if (error.message === "Conversation not found") {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to mark as read",
    });
  }
}
