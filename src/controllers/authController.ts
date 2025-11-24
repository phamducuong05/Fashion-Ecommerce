import { Request, Response } from "express";
import { prisma } from "../app"; // Import prisma từ app.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hàm Đăng ký
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user mới
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        // Tự động tạo luôn giỏ hàng cho user mới
        cart: {
          create: {},
        },
      },
    });

    res.status(201).json({ message: "Đăng ký thành công!", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàm Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    // 2. Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    // 3. Tạo Token (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
