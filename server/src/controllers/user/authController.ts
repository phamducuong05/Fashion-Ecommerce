import { Request, Response } from "express";
import authService from "../../services/user/authService";

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: "Registration successful!",
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
      message: "Login successful!",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export default { register, login };
