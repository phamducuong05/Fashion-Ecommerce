import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import userService from "../../services/user/userService";

const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userService.getUserProfile(userId);
    res.json(user);
  } catch (error: any) {
    console.error(error);
    // If user not found, return 404 so frontend can handle logout
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Error fetching profile" });
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
    res.status(500).json({ message: "Error updating profile" });
  }
};

export default { getProfile, updateProfile };
