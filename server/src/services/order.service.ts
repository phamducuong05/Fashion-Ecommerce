import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMyOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, thumbnail: true }, // Lấy tên và ảnh sản phẩm gốc
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" }, // Mới nhất lên đầu
  });
};

const getOrderById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId, // Quan trọng: Chỉ lấy nếu đúng là của user này
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, thumbnail: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  return order;
};

export default { getMyOrders, getOrderById };
