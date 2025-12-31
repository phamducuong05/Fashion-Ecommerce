import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { User } from "@prisma/client";

const signToken = (id: number) => {
  return jwt.sign({ id }, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const register = async (userData: any) => {
  const { email, password, fullName, phone } = userData;

  // 1) Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  // 2) Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3) Create user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      phone,
    },
  });

  // 4) Generate token
  const token = signToken(newUser.id);

  // Remove password from output
  const { password: _, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

export const login = async (loginData: any) => {
  const { email, password } = loginData;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // 2) Check if user exists & password is correct
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
      console.log("❌ [AUTH] Login failed: User not found", email);
  } else {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("⚡️ [AUTH] Login check:", { email, hasUser: true, isMatch, storedHashPrefix: user.password.substring(0, 10) });
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  // 3) Generate token
  const token = signToken(user.id);

  // Remove password from output
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const resetPassword = async (resetData: any) => {
  const { email, fullName, newPassword } = resetData;
  console.log("⚡️ [AUTH] Reset Password Request:", { email, fullName });

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("❌ [AUTH] Email not found");
    throw new AppError("Email not found", 404);
  }

  console.log("⚡️ [AUTH] User Found:", user.fullName);
  // 2. Verify Full Name matches (Case Insensitive for better UX)
  if (user.fullName?.toLowerCase().trim() !== fullName.toLowerCase().trim()) {
      console.log("❌ [AUTH] Name mismatch:", { required: fullName, actual: user.fullName });
      throw new AppError("Full name does not match our records", 400);
  }

  // 3. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // 4. Update User
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  console.log("✅ [AUTH] Password updated successfully for user:", user.email);

  return { message: "Password updated successfully" };
};
