// src/services/adminCustomerService.ts
import prisma from "../utils/prisma";

// Helper function to format order ID
function formatOrderId(id: number): string {
  return `ORD-${id.toString().padStart(4, "0")}`;
}

// Helper function to format date
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// GET /api/admin/customers - Get all customers with their orders
export async function getAllCustomers() {
  const users = await prisma.user.findMany({
    where: {
      role: "USER", // Only get customers, not admins
    },
    include: {
      orders: {
        include: {
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data to match the required format
  return users.map((user: any) => {
    // Calculate total spent
    const totalSpent = user.orders.reduce(
      (sum: number, order: any) => sum + Number(order.finalAmount),
      0
    );

    // Format orders with items
    const orders = user.orders.map((order: any) => {
      // Build items array
      const items = order.items.map((item: any) => {
        // Build category string
        const categoryString = item.variant.product.categories
          .map((cat: any) => {
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
        status: order.status.toLowerCase(),
        items,
      };
    });

    return {
      id: user.id,
      name: user.fullName || "Unknown",
      email: user.email,
      totalSpent: Math.round(totalSpent * 100) / 100,
      joinDate: formatDate(user.createdAt),
      orders,
    };
  });
}
