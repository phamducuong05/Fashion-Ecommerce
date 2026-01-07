import prisma from "../../utils/prisma";
import { AppError } from "../../utils/AppError";
import { sendOrderConfirmation } from "./emailService";
import { OrderStatus } from "@prisma/client";

const SHIPPING_COST_USD = 2.0; 
const FREE_SHIP_THRESHOLD_USD = 50.0;

interface CreateOrderInput {
  userId: number;
  shippingAddressId: number;
  paymentMethod: string;
  voucherCode?: string; // Sửa thành voucherCode cho tiện frontend gửi
}

export const createOrder = async (data: CreateOrderInput) => {
  const { userId, shippingAddressId, paymentMethod, voucherCode } = data;

  // 1. Dùng Transaction để đảm bảo tính toàn vẹn (Voucher, Stock, Order)
  const result = await prisma.$transaction(async (tx) => {
    // --- BƯỚC A: LẤY DỮ LIỆU ---

    // A1. Lấy giỏ hàng (Giả sử schema của bạn là CartItem nối trực tiếp User)
    // Nếu bạn có bảng Cart riêng thì dùng logic cũ
    const cartItems = await tx.cartItem.findMany({
      where: {
        cart: { userId: userId },
      },
      include: { variant: { include: { product: true } } },
    });

    if (cartItems.length === 0) {
      throw new AppError("Giỏ hàng trống, không thể thanh toán!", 400);
    }

    // A2. Lấy & Validate Địa chỉ (Tạo Snapshot)
    const address = await tx.address.findUnique({
      where: { id: shippingAddressId },
    });

    if (!address || address.userId !== userId) {
      throw new AppError("Địa chỉ giao hàng không hợp lệ!", 400);
    }

    // [NÂNG CẤP] Lưu dạng JSON Object đầy đủ
    const addressSnapshot = JSON.stringify({
      recipientName: address.recipientName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      ward: address.ward,
      detail: address.detail,
    });

    // --- BƯỚC B: TÍNH TOÁN TIỀN ---

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      // Check tồn kho
      if (item.quantity > item.variant.stock) {
        throw new AppError(
          `Sản phẩm "${item.variant.product.name}" hết hàng!`,
          400
        );
      }

      const price = Number(item.variant.product.price);
      subtotal += price * item.quantity;

      orderItemsData.push({
        variantId: item.variantId,
        quantity: item.quantity,
        price: price, // Giá tại thời điểm mua
      });
    }

    let shippingFee = SHIPPING_COST_USD;
    // Free ship nếu đơn > 500k (Ví dụ logic)
    if (subtotal > FREE_SHIP_THRESHOLD_USD) shippingFee = 0;

    // --- BƯỚC C: XỬ LÝ VOUCHER (ĐÃ BỔ SUNG) ---
    let discountAmount = 0;
    let voucherId = null;

    if (voucherCode) {
      const userVoucher = await tx.userVoucher.findFirst({
        where: {
          userId,
          isUsed: false,
          voucher: {
            code: voucherCode,
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gt: new Date() },
          },
        },
        include: { voucher: true },
      });

      if (!userVoucher) {
        throw new AppError("Voucher không hợp lệ hoặc đã hết hạn!", 400);
      }

      // Tính giảm giá
      const val = Number(userVoucher.voucher.value);
      if (userVoucher.voucher.type === "FIXED") {
        discountAmount = val;
      } else if (userVoucher.voucher.type === "PERCENT") {
        discountAmount = (subtotal * val) / 100;
      } else if (userVoucher.voucher.type === "FREESHIP") {
        discountAmount = shippingFee;
        shippingFee = 0;
      }

      // Chặn giảm giá âm
      if (discountAmount > subtotal + shippingFee) {
        discountAmount = subtotal + shippingFee;
      }

      voucherId = userVoucher.voucherId;

      // Đánh dấu voucher đã dùng (QUAN TRỌNG)
      await tx.userVoucher.update({
        where: { id: userVoucher.id },
        data: { isUsed: true, claimedAt: new Date() },
      });

      // Tăng biến đếm usage
      await tx.voucher.update({
        where: { id: userVoucher.voucherId },
        data: { usedCount: { increment: 1 } },
      });
    }

    const finalAmount = subtotal + shippingFee - discountAmount;

    // --- BƯỚC D: TẠO ORDER & TRỪ KHO ---

    // D1. Tạo Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        shippingAddress: addressSnapshot, // JSON
        paymentMethod,
        voucherId,
        status: OrderStatus.PENDING, // Enum
        paymentStatus: paymentMethod === "COD" ? "UNPAID" : "PENDING",

        totalAmount: subtotal,
        shippingFee,
        discountAmount,
        finalAmount: finalAmount > 0 ? finalAmount : 0,

        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true }, // Để return hoặc gửi mail
    });

    // D2. Trừ tồn kho
    for (const item of cartItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // D3. Xóa giỏ hàng
    await tx.cartItem.deleteMany({
      where: {
        cart: { userId: userId }, // 👈 SỬA Ở ĐÂY
      },
    });

    return newOrder;
  });

  // --- BƯỚC E: GỬI EMAIL (Ngoài Transaction để không block) ---
  // Phần này code bạn của bạn làm tốt rồi, giữ nguyên logic
  try {
    // Fetch lại full order có product info để gửi mail đẹp
    const fullOrder = await prisma.order.findUnique({
      where: { id: result.id },
      include: {
        orderItems: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    if (fullOrder) {
      // Giả sử bạn có hàm lấy email user từ userId
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await sendOrderConfirmation(user.email, fullOrder);
      }
    }
  } catch (err) {
    console.error("Email error:", err);
    // Không throw error ở đây vì Order đã tạo thành công rồi
  }

  return result;
};

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

export default { getMyOrders, getOrderById, createOrder };
