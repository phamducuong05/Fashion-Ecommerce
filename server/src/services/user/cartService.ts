import prisma from "../../utils/prisma";

interface CartItemResponse {
  id: string;
  image: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  stock: number;
  variantId: string;
}

// 1. Get cart
const getCart = async (userId: number): Promise<CartItemResponse[]> => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        orderBy: { id: "asc" },
        include: {
          variant: {
            include: {
              product: true,
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
        cartItems: { include: { variant: { include: { product: true } } } },
      },
    });
    return [];
  }

  const formattedItems: CartItemResponse[] = cart.cartItems.map((item) => {
    const variant = item.variant;
    const product = variant.product;

    return {
      id: item.id.toString(),
      image: variant.image || product.thumbnail || "https://via.placeholder.com/150",
      name: product.name,
      color: variant.color,
      size: variant.size,
      price: Number(product.price),
      quantity: item.quantity,
      stock: variant.stock,
      variantId: variant.id.toString(),
    };
  });

  return formattedItems;
};

// 2. Add to cart
const addToCart = async (
  userId: number,
  variantId: number,
  quantity: number
) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId: variantId,
      },
    },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: variantId,
        quantity: quantity,
      },
    });
  }
};

// 3. Update quantity
const updateQuantity = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  if (quantity < 1) {
    throw new Error("Quantity must be greater than 0");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

// 4. Remove item from cart
const removeItem = async (userId: number, cartItemId: number) => {
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export default { getCart, addToCart, updateQuantity, removeItem };
