import { Request, Response } from "express";
import * as productService from "../../services/user/productService";

export const getProducts = async (req: Request, res: Response) => {
  const { search, category, sort, page, limit } = req.query;

  const filters = {
    search: search as string,
    category: category as string,
    sort: sort as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12,
  };

  try {
    const result = await productService.getAllProducts(filters);

    res.json({
      success: true,
      data: result.data,
      pagination: result.meta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      res.status(400).json({ success: false, message: "Invalid product ID" });
      return;
    }

    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
