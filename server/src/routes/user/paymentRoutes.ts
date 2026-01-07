import express, { Request, Response, NextFunction } from "express";
import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import { authenticateToken } from "../../middlewares/auth.middleware";
import orderService from "../../services/user/orderService";
import prisma from "../../utils/prisma";

const router = express.Router();

const config = {
  vnp_TmnCode: process.env.VNP_TMN_CODE || "",
  vnp_HashSecret: process.env.VNP_HASH_SECRET || "",
  vnp_Url:
    process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl:
    process.env.VNP_RETURN_URL || "http://localhost:5173/payment-result",
};

function sortObject(obj: any) {
  let sorted: { [key: string]: string } = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

router.post(
  "/create_payment_url",
  authenticateToken,
  async function (req: Request | any, res: Response, next: NextFunction) {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const userId = req.user.id; // Lấy từ token
    const { bankCode, language, voucherCode, shippingAddressId } = req.body;

    // --- BƯỚC BẢO MẬT: Tự tính tiền tại Backend ---
    // 1. Lấy giỏ hàng
    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId } },
      include: { variant: { include: { product: true } } },
    });

    if (cartItems.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống" });

    // 2. Tính tổng tiền (Subtotal)
    let subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.variant.product.price) * item.quantity,
      0
    );

    // 3. Tính phí ship và giảm giá Voucher (Logic rút gọn giống order.service)
    let shippingFee = subtotal > 500000 ? 0 : 30000;

    // Nếu có voucher, tạm tính để trừ tiền (Đoạn này bạn có thể tái sử dụng logic tính voucher từ service)
    // Ở đây tôi giả sử tính toán xong ra Final Amount
    // Lưu ý: VNPAY yêu cầu số tiền là số nguyên, đơn vị VNĐ * 100
    // Ví dụ: 10,000 VND -> gửi 1000000

    let discountAmount = 0;

    if (voucherCode) {
      // Tìm xem User có sở hữu voucher này và nó còn hạn không
      const userVoucher = await prisma.userVoucher.findFirst({
        where: {
          userId,
          isUsed: false, // Phải chưa dùng
          voucher: {
            code: voucherCode,
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gt: new Date() },
          },
        },
        include: { voucher: true },
      });

      // Nếu voucher hợp lệ thì tính tiền giảm
      if (userVoucher) {
        const val = Number(userVoucher.voucher.value);
        if (userVoucher.voucher.type === "FIXED") {
          discountAmount = val;
        } else if (userVoucher.voucher.type === "PERCENT") {
          discountAmount = (subtotal * val) / 100;
        } else if (userVoucher.voucher.type === "FREESHIP") {
          discountAmount = shippingFee;
          shippingFee = 0; // Set phí ship hiển thị về 0
        }
      }
    }

    let finalAmount = subtotal + shippingFee - discountAmount;
    // TODO: Áp dụng logic trừ voucher ở đây nếu muốn hiển thị đúng số tiền sau giảm trên trang VNPAY

    // --- KẾT THÚC BƯỚC BẢO MẬT ---

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;

    // Tạo mã đơn hàng tạm thời (Hoặc bạn có thể tạo Order với status "PENDING_PAYMENT" trước rồi dùng ID đó)
    // Ở đây ta dùng timestamp + userId để unique
    const orderId = moment(date).format("DDHHmmss") + `_${userId}`;

    let locale = language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    const currCode = "VND";
    let vnp_Params: { [key: string]: any } = {};

    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = `Thanh toan don hang ${orderId}`;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = finalAmount * 100; // Nhân 100 theo quy định VNPAY
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res
      .status(200)
      .json({ code: "00", message: "Success", paymentUrl: vnpUrl });
  }
);

// 2. API VERIFY VÀ TẠO ĐƠN HÀNG (Frontend gọi API này sau khi VNPAY redirect về)
// Method: GET /api/payment/vnpay_return
router.get(
  "/vnpay_return",
  authenticateToken,
  async function (req: Request | any, res: Response, next: NextFunction) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    // --- BƯỚC SỬA QUAN TRỌNG TẠI ĐÂY ---
    
    // Tạo một object mới để chứa dữ liệu sạch
    let vnp_Params_Fix: any = {};

    for (const key in vnp_Params) {
        // Quy tắc vàng: 
        // 1. Chỉ lấy key bắt đầu bằng "vnp_"
        // 2. Không lấy chính cái hash (vnp_SecureHash)
        if (key.startsWith('vnp_') && key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
            vnp_Params_Fix[key] = vnp_Params[key];
        }
    }

    // Sau đó dùng vnp_Params_Fix để sort và hash (thay vì dùng vnp_Params gốc)
    vnp_Params_Fix = sortObject(vnp_Params_Fix);

    const signData = querystring.stringify(vnp_Params_Fix, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    if (secureHash === signed) {
      // Check mã phản hồi từ VNPAY (00 là thành công)
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        // --- THANH TOÁN THÀNH CÔNG ---
        // Bây giờ mới tiến hành tạo đơn hàng trong Database

        // Lấy thông tin từ Frontend gửi kèm (hoặc parse từ vnp_TxnRef nếu bạn lưu userId vào đó)
        const userId = req.user.id;

        // Lưu ý: API này được gọi bởi Frontend, Frontend phải gửi kèm:
        // addressId, voucherCode (lấy từ localStorage 'pendingCheckout' mà ta đã lưu ở bài trước)
        const addressId = Number(req.query.addressId);
        const voucherCode = req.query.voucherCode as string;

        try {
          // Gọi lại hàm createOrder siêu mạnh mẽ mà ta đã viết ở bài trước
          // Nhưng lần này paymentMethod là "ONLINE"
          const newOrder = await orderService.createOrder({
            userId,
            shippingAddressId: addressId,
            paymentMethod: "ONLINE", // Đã thanh toán qua VNPAY
            voucherCode: voucherCode,
          });

          // Cập nhật trạng thái thanh toán thành PAID
          await prisma.order.update({
            where: { id: newOrder.id },
            data: { paymentStatus: "PAID" },
          });

          res.status(200).json({
            code: "00",
            message: "Order created",
            orderId: newOrder.id,
          });
        } catch (error: any) {
          console.error(error);
          res.status(400).json({
            code: "99",
            message: "Create order failed: " + error.message,
          });
        }
      } else {
        res.status(200).json({
          code: vnp_Params["vnp_ResponseCode"],
          message: "Payment Failed",
        });
      }
    } else {
      res.status(200).json({ code: "97", message: "Checksum failed" });
    }
  }
);

export default router;
