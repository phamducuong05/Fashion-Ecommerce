import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or specific location
const envPath = path.join(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Error loading .env file:", result.error);
} else {
  console.log("✅ .env loaded from:", envPath);
}

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Email
  MAIL_USER: process.env.MAIL_USER || process.env.SMTP_USER,
  MAIL_PASS: process.env.MAIL_PASS || process.env.SMTP_PASS,
  
  // SMTP Config (Optional, for non-Gmail)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,

  // VNPay
  VNP_TMNCODE: process.env.VNP_TMNCODE,
  VNP_HASHSECRET: process.env.VNP_HASHSECRET,
  VNP_URL: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNP_RETURN_URL: process.env.VNP_RETURN_URL || 'http://localhost:3000/api/orders/vnpay_return',
};

// Simple check for required variables
const requiredEnv = ['DATABASE_URL'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.warn(`WARNING: Missing required environment variables: ${missingEnv.join(', ')}`);
}
