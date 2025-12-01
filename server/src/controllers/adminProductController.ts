// src/controllers/adminProductController.ts
import { Request, Response } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/adminProductService";

// GET /api/admin/products
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await getAllProducts();
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

// POST /api/admin/products
export async function addProduct(req: Request, res: Response) {
  try {
    const { name, category, price, stock, image, description, status, variants } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || !variants) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, price, variants",
      });
      return;
    }

    const product = await createProduct({
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      image: image || "",
      description: description || "",
      status: status || "available",
      variants,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
}

// PUT /api/admin/products/:id
export async function editProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const { name, category, price, stock, image, description, status, variants } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || !variants) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, price, variants",
      });
      return;
    }

    const product = await updateProduct(id, {
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      image: image || "",
      description: description || "",
      status: status || "available",
      variants,
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error.message === "Product not found") {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
}

// DELETE /api/admin/products/:id
export async function removeProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const result = await deleteProduct(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);

    if (error.message === "Product not found") {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
}
