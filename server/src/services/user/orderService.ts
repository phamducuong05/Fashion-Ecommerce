import prisma from "../../utils/prisma";

const getMyOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
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
    orderBy: { createdAt: "desc" },
  });
};

const getOrderById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
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
