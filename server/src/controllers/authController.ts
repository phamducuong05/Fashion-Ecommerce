import { Request, Response } from "express";
import authService from "../services/auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: "Đăng ký thành công!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      message: "Đăng nhập thành công!",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export default { register, login };
