import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares"; // Import interface AuthRequest bạn đã có
import userService from "../services/user.service";

const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Lấy ID từ token đã giải mã qua middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userService.getUserProfile(userId);
    res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy thông tin cá nhân" });
  }
};

const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, avatar } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updatedUser = await userService.updateUser(userId, { name, avatar });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật thông tin" });
  }
};

export default { getProfile, updateProfile };
