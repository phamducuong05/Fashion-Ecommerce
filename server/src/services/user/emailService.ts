import nodemailer from "nodemailer";
// Giả sử bạn lấy env từ process.env hoặc file config của bạn
// import { env } from "../utils/env";
const env = process.env; // Hoặc config của bạn

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendOrderConfirmation = async (
  toEmail: string,
  orderData: any
) => {
  try {
    const { id, totalAmount, orderItems, shippingAddress, createdAt } =
      orderData;

    // --- 1. XỬ LÝ ĐỊA CHỈ (JSON -> String đẹp) ---
    let addressDisplay = shippingAddress;
    try {
      // Vì DB lưu dạng JSON string, ta cần parse ra để hiển thị đẹp
      const addrObj = JSON.parse(shippingAddress);
      addressDisplay = `
        <p style="margin: 0;"><strong>${addrObj.recipientName}</strong> (${addrObj.phone})</p>
        <p style="margin: 0;">${addrObj.detail}</p>
        <p style="margin: 0;">${addrObj.ward}, ${addrObj.district}, ${addrObj.city}</p>
      `;
    } catch (e) {
      // Nếu không phải JSON (dữ liệu cũ), giữ nguyên string
      addressDisplay = shippingAddress;
    }

    // --- 2. FORMAT TIỀN TỆ ---
    const formatMoney = (amount: any) => Number(amount).toFixed(2);

    // --- 3. TẠO HTML LIST SẢN PHẨM ---
    const itemsHtml = orderItems
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold;">${item.variant.product.name}</div>
            <div style="font-size: 12px; color: #666;">Size: ${
              item.variant.size
            } | Color: ${item.variant.color}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${formatMoney(
          item.price
        )}</td>
      </tr>
    `
      )
      .join("");

    // --- 4. GỬI MAIL ---
    const mailOptions = {
      from: env.FROM_EMAIL,
      to: toEmail,
      subject: `Order Confirmation #${id} - Fashion Ecommerce`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          
          <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmed</h1>
          </div>

          <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
            <p>Hi there,</p>
            <p>Thank you for shopping with us! We've received your order <strong>#${id}</strong> and are preparing it for shipment.</p>
            
            <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Shipping To:</h3>
              ${addressDisplay}
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background: #f4f4f4;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                   <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #333;"><strong>Subtotal:</strong></td>
                   <td style="padding: 12px; text-align: right; border-top: 2px solid #333;">$${formatMoney(
                     Number(totalAmount) -
                       Number(orderData.shippingFee) +
                       Number(orderData.discountAmount)
                   )}</td>
                </tr>
                 <tr>
                   <td colspan="2" style="padding: 5px 12px; text-align: right; color: #666;">Shipping:</td>
                   <td style="padding: 5px 12px; text-align: right;">$${formatMoney(
                     orderData.shippingFee
                   )}</td>
                </tr>
                 <tr>
                   <td colspan="2" style="padding: 5px 12px; text-align: right; color: green;">Discount:</td>
                   <td style="padding: 5px 12px; text-align: right; color: green;">-$${formatMoney(
                     orderData.discountAmount
                   )}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold;">Total:</td>
                  <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold;">$${formatMoney(
                    totalAmount
                  )}</td>
                </tr>
              </tfoot>
            </table>

            <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #999;">
              If you have any questions, reply to this email or contact support.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Không throw lỗi để tránh làm crash luồng tạo đơn hàng chính
    return false;
  }
};
