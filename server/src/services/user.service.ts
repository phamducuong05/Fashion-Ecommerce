import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";

type UpdateProfileData = {
  fullName?: string;
  phone?: string;
  address?: string; // Simplistic address update for now (or handle Address model separate)
};

export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      createdAt: true,
      addresses: true, // Include addresses
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateUserProfile = async (
  userId: number,
  data: UpdateProfileData
) => {
  // Update basic info
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      phone: data.phone,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
    },
  });

  return user;
};

export const getUserOrders = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, thumbnail: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  return orders;
};

export const getUserOrderById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, thumbnail: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order || order.userId !== userId) {
    throw new AppError("Order not found", 404);
  }

  return order;
};
