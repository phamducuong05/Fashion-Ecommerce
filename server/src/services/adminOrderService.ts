// src/services/adminOrderService.ts
import prisma from "../utils/prisma";

// Type definitions
type OrderWithRelations = {
  id: number;
  userId: number;
  status: string;
  totalAmount: any;
  shipping: any;
  discountAmount: any;
  finalAmount: any;
  payment: string;
  address: string;
  phone: string;
  createdAt: Date;
  voucherId: number | null;
  user: {
    id: number;
    email: string;
    fullName: string | null;
    phone: string | null;
  };
  items: Array<{
    id: number;
    orderId: number;
    variantId: number;
    quantity: number;
    price: any;
    variant: {
      id: number;
      productId: number;
      color: string;
      size: string;
      image: string | null;
      product: {
        id: number;
        name: string;
        thumbnail: string | null;
        categories: Array<{
          id: number;
          name: string;
          parent: { name: string } | null;
        }>;
      };
    };
  }>;
};

// Helper function to format order ID
function formatOrderId(id: number): string {
  return `ORD-${id.toString().padStart(4, "0")}`;
}

// Helper function to format date
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Helper function to map status to lowercase
function mapStatus(status: string): string {
  return status.toLowerCase();
}

// Helper function to map status from lowercase to enum
function mapStatusToEnum(status: string): "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" {
  const statusMap: Record<string, "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"> = {
    pending: "PENDING",
    processing: "PROCESSING",
    shipped: "SHIPPED",
    delivered: "DELIVERED",
    cancelled: "CANCELLED",
  };
  return statusMap[status.toLowerCase()] || "PENDING";
}

// GET /api/admin/orders - Get all orders
export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
        },
      },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  categories: {
                    include: {
                      parent: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data to match the required format
  return orders.map((order: OrderWithRelations) => {
    // Build items array
    const items = order.items.map((item) => {
      // Build category string
      const categoryString = item.variant.product.categories
        .map((cat) => {
          if (cat.parent) {
            return `${cat.parent.name} - ${cat.name}`;
          }
          return cat.name;
        })
        .join(", ");

      return {
        productName: item.variant.product.name,
        category: categoryString || "Uncategorized",
        quantity: item.quantity,
        price: Number(item.price),
        size: item.variant.size,
        color: item.variant.color,
        imageUrl: item.variant.image || item.variant.product.thumbnail || "",
      };
    });

    return {
      id: formatOrderId(order.id),
      date: formatDate(order.createdAt),
      total: Number(order.finalAmount),
      status: mapStatus(order.status),
      customerName: order.user.fullName || "Unknown",
      customerEmail: order.user.email,
      shippingAddress: order.address,
      items,
    };
  });
}

// PUT /api/admin/orders/:id - Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  // Parse order ID (remove "ORD-" prefix if present)
  let numericId: number;
  
  if (orderId.startsWith("ORD-")) {
    numericId = parseInt(orderId.replace("ORD-", ""), 10);
  } else {
    numericId = parseInt(orderId, 10);
  }

  if (isNaN(numericId)) {
    throw new Error("Invalid order ID");
  }

  // Check if order exists
  const existingOrder = await prisma.order.findUnique({
    where: { id: numericId },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // Validate status
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status.toLowerCase())) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: numericId },
    data: {
      status: mapStatusToEnum(status),
    },
  });

  return {
    id: formatOrderId(updatedOrder.id),
    status: mapStatus(updatedOrder.status),
  };
}
