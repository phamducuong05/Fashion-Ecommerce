import { Request, Response } from "express";
import { prisma } from "../app";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock, categoryId, slug } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        stock: Number(stock),
        categoryId,
        slug,
      },
    });
    res.status(201).json({ message: "Tạo sản phẩm thành công", data: product });
  } catch (error) {
    console.log("------------------------------------------------");
    console.error("❌ LỖI TẠO SẢN PHẨM:", error);
    console.log("------------------------------------------------");

    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
    res
      .status(201)
      .json({ message: "Tạo danh mục thành công", data: category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
