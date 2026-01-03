import { Request, Response } from "express";
import * as categoryService from "../../services/user/categoryService";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
};
