import prisma from "../../utils/prisma";

interface SaveMessageData {
  conversationId?: number;
  userId: number;
  message: string;
  sender: "CUSTOMER" | "ADMIN";
}

export class ChatService {
  // Save a new message
  static async saveMessage(data: SaveMessageData) {
    let conversationId = data.conversationId;

    // For CUSTOMER messages, verify user exists and get/create conversation
    if (data.sender === "CUSTOMER") {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new Error(`User with id ${data.userId} not found. Please use an existing user ID from your database.`);
      }

      // If no conversation exists, get or create one
      if (!conversationId) {
        // Check if user already has an open conversation
        const existingConversation = await prisma.chatConversation.findFirst({
          where: {
            userId: data.userId,
            status: { in: ["OPEN", "PENDING"] },
          },
        });

        if (existingConversation) {
          conversationId = existingConversation.id;
        } else {
          // Create new conversation
          const conversation = await prisma.chatConversation.create({
            data: {
              userId: data.userId,
              status: "OPEN",
            },
          });
          conversationId = conversation.id;
        }
      }
    }

    // For ADMIN messages, conversationId MUST be provided
    if (data.sender === "ADMIN" && !conversationId) {
      throw new Error("Admin messages must include a conversationId");
    }

    // Verify the conversationId exists
    if (conversationId) {
      const conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
      });
      
      if (!conversation) {
        throw new Error(`Conversation with id ${conversationId} not found`);
      }
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversationId!,
        content: data.message,
        sender: data.sender,
      },
      include: {
        conversation: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return message;
  }

  // Get all conversations for admin
  static async getAllConversations() {
    const conversations = await prisma.chatConversation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get last message
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return conversations;
  }

  // Get messages for a specific conversation
  static async getMessages(conversationId: number) {
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  }

  // Mark conversation as read (reset unread count)
  static async markConversationAsRead(conversationId: number) {
    // Update conversation unreadCount to 0
    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { unreadCount: 0 },
    });

    // Mark all customer messages as read
    await prisma.chatMessage.updateMany({
      where: {
        conversationId,
        sender: "CUSTOMER",
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }

  // Get or create conversation for a user
  static async getOrCreateConversation(userId: number) {
    let conversation = await prisma.chatConversation.findFirst({
      where: { 
        userId,
        status: { in: ["OPEN", "PENDING"] }
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          userId,
          status: "OPEN",
        },
        include: {
          messages: true,
        },
      });
    }

    return conversation;
  }

  // Close conversation
  static async closeConversation(conversationId: number) {
    return prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status: "CLOSED" },
    });
  }
}
