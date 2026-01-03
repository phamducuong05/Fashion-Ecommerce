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

    // If no conversation exists, create one
    if (!conversationId) {
      const conversation = await prisma.chatConversation.create({
        data: {
          userId: data.userId,
          status: "OPEN",
        },
      });
      conversationId = conversation.id;
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversationId,
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
