import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Cấu hình Transporter (Người vận chuyển)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true cho port 465, false cho các port khác
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Hàm gửi mail xác nhận đơn hàng
export const sendOrderConfirmationEmail = async (
  toEmail: string, 
  orderCode: string, 
  totalAmount: number
) => {
  try {
    const info = await transporter.sendMail({
      from: '"Adam Fashion Store" <no-reply@adamfashion.com>', // Tên người gửi
      to: toEmail, // Gửi đến email khách hàng
      subject: `Xác nhận đơn hàng #${orderCode}`, // Tiêu đề
      // Nội dung email (HTML)
      html: `
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>Đơn hàng <b>#${orderCode}</b> của bạn đã được ghi nhận.</p>
        <p>Tổng giá trị: <b>${Number(totalAmount).toLocaleString('vi-VN')} VNĐ</b></p>
        <p>Chúng tôi sẽ sớm liên hệ để giao hàng.</p>
        <br/>
        <p>Trân trọng,<br/>Adam Fashion Team</p>
      `,
    });

    console.log("✅ Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    return false; // Không throw error để tránh làm crash luồng đặt hàng
  }
};