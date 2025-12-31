import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";

export const getCart = async (userId: number) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { categories: true },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { categories: true },
                },
              },
            },
          },
        },
      },
    });
  }

  // Transform to Frontend format (optional, or do in controller)
  return cart;
};

export const addToCart = async (userId: number, productId: number, quantity: number, color: string, size: string) => {
  // 1. Find the product variant
  const variant = await prisma.productVariant.findFirst({
    where: {
      productId,
      color,
      size,
    },
  });

  if (!variant) {
    throw new AppError("Product variant (color/size) not found", 404);
  }

  if (variant.stock < quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  // 2. Get or Create Cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 3. Check if item exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      variantId: variant.id,
    },
  });

  if (existingItem) {
    // Update quantity
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Create new item
    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: variant.id,
        quantity,
      },
    });
  }
};

export const updateCartItem = async (userId: number, cartItemId: number, quantity: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404);

  // Check ownership
  const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id }
  });

  if (!item) throw new AppError("Item not found in your cart", 404);

  if (quantity <= 0) {
      return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

export const removeFromCart = async (userId: number, cartItemId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404);

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id }
  });

  if (!item) throw new AppError("Item not found in your cart", 404);

  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const clearCart = async (userId: number) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;

    return prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
    });
}
