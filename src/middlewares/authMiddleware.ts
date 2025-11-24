import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Định nghĩa lại kiểu Request để thêm trường user vào
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // 1. Lấy token từ header (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Không có quyền truy cập (Thiếu Token)" });
  }

  const token = authHeader.split(" ")[1]; // Lấy phần chuỗi token sau chữ Bearer

  try {
    // 2. Kiểm tra Token có hợp lệ không
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    // 3. Gắn thông tin user vào request để các hàm sau dùng
    req.user = decoded;

    next(); // Cho phép đi tiếp
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware kiểm tra quyền Admin
export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Bạn không phải là Admin!" });
  }
  next();
};
