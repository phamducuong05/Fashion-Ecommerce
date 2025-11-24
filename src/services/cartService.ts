import { prisma } from "../app";

// 1. Lấy giỏ hàng
export const findCartByUserId = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  return cart;
};

// 2. Thêm vào giỏ (Upsert)
export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  // Đảm bảo giỏ hàng tồn tại
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Upsert item
  const cartItem = await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId: productId,
      quantity: quantity,
    },
  });

  return cartItem;
};
