import nodemailer from "nodemailer";
import { env } from "../config/env";
import { Order, OrderItem, ProductVariant, Product } from "@prisma/client";

// Define strict types for included relations
type OrderWithItems = Order & {
  items: (OrderItem & {
    variant: ProductVariant & {
      product: Product;
    };
  })[];
};

const createTransporter = () => {
  if (env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
  }

  // Fallback to Gmail service
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });
};

const transporter = createTransporter();

export const sendOrderConfirmation = async (
  email: string,
  order: OrderWithItems
) => {
  if (!env.MAIL_USER || !env.MAIL_PASS) {
      console.warn("Email credentials missing. Skipping email send.");
      return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
        ${item.variant.product.name} (${item.variant.color}, ${item.variant.size})
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${Number(item.price).toLocaleString()} đ</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: `"Fashion Shop" <${env.MAIL_USER}>`,
    to: email,
    subject: `Order Confirmation #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>#${order.id}</strong> has been placed successfully.</p>
        
        <h3>Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: left;">Qty</th>
              <th style="padding: 12px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 12px; font-weight: bold;">${Number(order.finalAmount || order.totalAmount).toLocaleString()} đ</td>
            </tr>
          </tfoot>
        </table>

        <p><strong>Payment Method:</strong> ${order.payment}</p>
        <p><strong>Shipping Address:</strong> ${order.address}</p>
        
        <p style="margin-top: 24px; font-size: 12px; color: #666;">
          If you have any questions, please reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for Order #${order.id}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
