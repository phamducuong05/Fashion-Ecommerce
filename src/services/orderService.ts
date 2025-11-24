import { prisma } from "../app";
import * as emailService from "./emailService";

interface CheckoutInput {
  userId: string;
  shippingAddress: string;
  customerName?: string;
  customerPhone?: string;
}

export const checkout = async ({
  userId,
  shippingAddress,
  customerName,
  customerPhone,
}: CheckoutInput) => {
  // =================================================================
  // BƯỚC 1: DATABASE TRANSACTION (Xử lý dữ liệu an toàn)
  // =================================================================
  // Mọi thao tác trong khối này sẽ cùng thành công hoặc cùng thất bại (Rollback)
  const resultOrder = await prisma.$transaction(async (tx) => {
    // 1. Lấy giỏ hàng của User
    // Kèm theo thông tin Product (để lấy giá) và User (để lấy email/tên)
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    // Validate: Giỏ hàng phải tồn tại và có sản phẩm
    if (!cart || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống, không thể đặt hàng");
    }

    // 2. Tính toán tổng tiền & Chuẩn bị dữ liệu chi tiết đơn hàng
    let totalAmount = 0;

    const orderItemsData = cart.items.map((item) => {
      // Lấy giá từ Database (Product), không tin tưởng giá từ Client
      const price = Number(item.product.price);

      // Tính tổng tiền
      totalAmount += price * item.quantity;

      // Tạo object cho OrderItem (Snapshot dữ liệu tại thời điểm mua)
      return {
        productId: item.productId,
        productName: item.product.name,
        price: price,
        quantity: item.quantity,
      };
    });

    // 3. Tạo Đơn hàng (Order)
    const newOrder = await tx.order.create({
      data: {
        userId,
        orderCode: `ORD-${Date.now()}`, // Tự sinh mã đơn (Có thể thay bằng UUID hoặc thư viện khác)
        status: "PENDING",
        totalAmount,
        shippingAddress,
        // Logic lấy tên/sđt: Ưu tiên nhập tay -> Lấy từ Profile User -> Mặc định
        customerName: customerName || cart.user.fullName || "Khách hàng",
        customerPhone: customerPhone || cart.user.phone || "",
        items: {
          create: orderItemsData, // Prisma tự động tạo các dòng OrderItem liên quan
        },
      },
      // Trả về kèm items để hiển thị cho Client ngay sau khi đặt
      include: { items: true },
    });

    // 4. Xóa sạch các món trong Giỏ hàng (Reset Cart)
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Trả về kết quả transaction, kèm thêm email để dùng ở bước sau
    return { ...newOrder, userEmail: cart.user.email };
  });

  // =================================================================
  // BƯỚC 2: GỬI EMAIL (Side Effect - Nằm ngoài Transaction)
  // =================================================================
  // Chỉ chạy khi Transaction trên đã thành công (có resultOrder)

  if (resultOrder) {
    console.log(
      `🚀 Đơn hàng ${resultOrder.orderCode} tạo thành công. Đang gửi mail...`,
    );

    // Gọi hàm gửi mail dạng "Fire and Forget" (Không dùng await)
    // Giúp API phản hồi nhanh cho khách hàng, việc gửi mail cứ chạy ngầm
    emailService
      .sendOrderConfirmationEmail(
        resultOrder.userEmail,
        resultOrder.orderCode,
        Number(resultOrder.totalAmount),
      )
      .catch((err) => {
        // Nếu gửi mail lỗi thì chỉ log ra, KHÔNG làm lỗi đơn hàng
        console.error("❌ Lỗi gửi email background:", err);
      });
  }

  return resultOrder;
};
