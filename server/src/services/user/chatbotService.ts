import prisma from "../../utils/prisma";
import { AppError } from "../../utils/AppError";
import axios from "axios";

const PYTHON_AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";

interface AIProductResponse {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
}

interface AIServiceResponse {
  content: string;
  intent: string;
  products: AIProductResponse[];
}

// 1. Get all chat sessions for a user
const getChatSessions = async (userId: number) => {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return sessions;
};

// 2. Get chat session detail with messages and products
const getChatSessionById = async (sessionId: number, userId: number) => {
  // Check if session belongs to user
  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  thumbnail: true,
                  rating: true,
                  reviewCount: true,
                  variants: {
                    select: {
                      color: true,
                      size: true,
                      stock: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw new AppError("Chat session not found or unauthorized", 404);
  }

  // Format response
  const formattedMessages = session.messages.map((msg) => ({
    id: msg.id.toString(),
    role: msg.role.toLowerCase(),
    content: msg.content,
    products: msg.products.map((mp) => ({
      id: mp.product.id,
      name: mp.product.name,
      price: mp.product.price,
      image: mp.product.thumbnail,
      slug: mp.product.slug,
      rating: mp.product.rating,
      reviewCount: mp.product.reviewCount,
      colors: [...new Set(mp.product.variants.map((v) => v.color))],
      sizes: [...new Set(mp.product.variants.map((v) => v.size))],
    })),
    createdAt: msg.createdAt,
  }));

  return {
    id: session.id,
    title: session.title,
    messages: formattedMessages,
  };
};

// 3. Create new chat session
const createChatSession = async (userId: number) => {
  const newSession = await prisma.chatSession.create({
    data: {
      userId,
      title: "New Chat",
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return newSession;
};

// 4. Send message and get AI response
const sendMessage = async (
  sessionId: number,
  userId: number,
  content: string
) => {
  // Validate session exists and belongs to user
  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      messages: {
        select: { id: true, role: true },
      },
    },
  });

  if (!session) {
    throw new AppError("Chat session not found or unauthorized", 404);
  }

  // Save user message
  const userMessage = await prisma.chatBotMessage.create({
    data: {
      sessionId,
      role: "USER",
      content,
    },
  });

  // Update title if this is the first user message
  const userMessageCount = session.messages.filter(
    (m) => m.role === "USER"
  ).length;

  if (userMessageCount === 0) {
    const title = content.length > 50 ? content.substring(0, 50) + "..." : content;
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title },
    });
  }

  try {
    // Call AI Service
    const aiResponse = await axios.post<AIServiceResponse>(
      `${PYTHON_AI_SERVICE_URL}/api/v1/chat`,
      {
        session_id: sessionId,
        query: content,
      },
      {
        timeout: 30000, // 30 second timeout
      }
    );

    const { content: botContent, products: aiProducts } = aiResponse.data;

    // Save bot message
    const botMessage = await prisma.chatBotMessage.create({
      data: {
        sessionId,
        role: "BOT",
        content: botContent,
      },
    });

    // Save product links if any
    if (aiProducts && aiProducts.length > 0) {
      // Extract product IDs and validate they exist in database
      const productIds = aiProducts.map((p) => parseInt(p.id));
      
      // Check which products actually exist
      const existingProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds }
        },
        select: { id: true }
      });
      
      const existingProductIds = existingProducts.map(p => p.id);
      
      // Only save links for products that exist
      if (existingProductIds.length > 0) {
        await prisma.messageProduct.createMany({
          data: existingProductIds.map((productId) => ({
            messageId: botMessage.id,
            productId,
          })),
        });
      }
      
      // Log if some products don't exist
      if (existingProductIds.length < productIds.length) {
        const missingIds = productIds.filter(id => !existingProductIds.includes(id));
        console.warn(`Some products from AI response don't exist in database: ${missingIds.join(', ')}`);
      }
    }

    // Format response using products from AI service directly
    const formattedProducts = aiProducts.map((p) => ({
      id: parseInt(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
      rating: p.rating,
      reviewCount: p.reviewCount,
      colors: p.colors,
      sizes: p.sizes,
      slug: '', // Python service doesn't return slug, will be empty for now
    }));

    return {
      id: botMessage.id.toString(),
      role: "bot",
      content: botMessage.content,
      products: formattedProducts,
      createdAt: botMessage.createdAt,
    };
  } catch (error: any) {
    console.error("AI Service Error:", error.message);
    
    // Save error message as bot response
    const errorBotMessage = await prisma.chatBotMessage.create({
      data: {
        sessionId,
        role: "BOT",
        content: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
      },
    });

    return {
      id: errorBotMessage.id.toString(),
      role: "bot",
      content: errorBotMessage.content,
      products: [],
      createdAt: errorBotMessage.createdAt,
    };
  }
};

// 5. Delete chat session
const deleteChatSession = async (sessionId: number, userId: number) => {
  // Check if session belongs to user
  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new AppError("Chat session not found or unauthorized", 404);
  }

  // Delete session (cascade will delete messages and message_products)
  await prisma.chatSession.delete({
    where: { id: sessionId },
  });

  return { success: true };
};

// 6. Sync products to AI service
const syncProductsToAI = async () => {
  try {
    // Get all active products with their variants
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        variants: true,
        categories: true,
      },
    });

    // Transform products to AI service format
    const productsForAI = products.map((product: any) => {
      const uniqueColors = [...new Set(product.variants.map((v: any) => v.color))];
      const uniqueSizes = [...new Set(product.variants.map((v: any) => v.size))];
      
      return {
        id: product.id.toString(),
        name: product.name,
        description: product.description || "",
        price: parseFloat(product.price.toString()),
        originalPrice: parseFloat(product.originalPrice.toString()),
        image: product.thumbnail || "",
        rating: product.rating,
        reviewCount: product.reviewCount,
        colors: uniqueColors,
        sizes: uniqueSizes,
        categories: product.categories.map((c: any) => c.name),
        slug: product.slug,
      };
    });

    // Send to Python AI service
    const response = await axios.post(
      `${PYTHON_AI_SERVICE_URL}/api/v1/sync-products`,
      { products: productsForAI },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    console.log("✅ Products synced to AI service:", response.data);
    
    return {
      success: true,
      syncedCount: productsForAI.length,
      message: response.data.message || "Products synced successfully",
    };
  } catch (error: any) {
    console.error("❌ Error syncing products to AI:", error.message);
    
    // Don't throw error - just log it
    return {
      success: false,
      syncedCount: 0,
      message: `Failed to sync: ${error.message}`,
    };
  }
};

export default {
  getChatSessions,
  getChatSessionById,
  createChatSession,
  sendMessage,
  deleteChatSession,
  syncProductsToAI,
};
