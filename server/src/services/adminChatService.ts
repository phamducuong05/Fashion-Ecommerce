// src/services/adminChatService.ts
import prisma from "../utils/prisma";

// GET /api/admin/chatmessages - Get all chat conversations with messages
export async function getAllChatConversations() {
  const conversations = await prisma.chatConversation.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      messages: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Transform data to match the required format
  return conversations.map((conv: any) => {
    const lastMessage = conv.messages.length > 0 
      ? conv.messages[conv.messages.length - 1].text 
      : "";

    return {
      id: conv.id,
      customerName: conv.user.fullName || "Unknown",
      customerEmail: conv.user.email,
      lastMessage,
      unread: conv.unreadCount,
      messages: conv.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp,
      })),
    };
  });
}

// PUT /api/admin/chatmessages/:id - Send admin reply to a conversation
export async function sendAdminMessage(conversationId: number, text: string) {
  // Check if conversation exists
  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Create admin message
  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      sender: "admin",
      text,
    },
  });

  // Update conversation (reset unread count and update timestamp)
  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      unreadCount: 0,
      updatedAt: new Date(),
    },
  });

  return {
    id: message.id,
    sender: message.sender,
    text: message.text,
    timestamp: message.timestamp,
  };
}

// Mark conversation as read
export async function markAsRead(conversationId: number) {
  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      unreadCount: 0,
    },
  });

  return { id: conversationId, unread: 0 };
}
