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

export default { getMyOrders };
