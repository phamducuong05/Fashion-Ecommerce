import { Request, Response } from "express";
import * as productService from "../services/productService";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ" });
      return;
    }

    const product = await productService.getProductById(id);

    if (!product) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
