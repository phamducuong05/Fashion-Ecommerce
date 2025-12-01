// src/controllers/adminDiscountController.ts
import { Request, Response } from "express";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../services/adminDiscountService";

// GET /api/admin/discounts
export async function getDiscounts(req: Request, res: Response) {
  try {
    const discounts = await getAllDiscounts();
    res.json({
      success: true,
      data: discounts,
    });
  } catch (error) {
    console.error("Error fetching discounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discounts",
    });
  }
}

// POST /api/admin/discounts
export async function addDiscount(req: Request, res: Response) {
  try {
    const { code, description, percentOff, stock, startDate, endDate, active } = req.body;

    // Validate required fields
    if (!code || percentOff === undefined || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: code, percentOff, startDate, endDate",
      });
      return;
    }

    const discount = await createDiscount({
      code,
      description: description || "",
      percentOff: Number(percentOff),
      stock: Number(stock) || 0,
      startDate,
      endDate,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      data: discount,
    });
  } catch (error: any) {
    console.error("Error creating discount:", error);

    if (error.code === "P2002") {
      res.status(400).json({
        success: false,
        message: "Discount code already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create discount",
    });
  }
}

// PUT /api/admin/discounts/:id
export async function editDiscount(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid discount ID",
      });
      return;
    }

    const { code, description, percentOff, stock, startDate, endDate, active } = req.body;

    // Validate required fields
    if (!code || percentOff === undefined || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: code, percentOff, startDate, endDate",
      });
      return;
    }

    const discount = await updateDiscount(id, {
      code,
      description: description || "",
      percentOff: Number(percentOff),
      stock: Number(stock) || 0,
      startDate,
      endDate,
      active: active !== undefined ? active : true,
    });

    res.json({
      success: true,
      data: discount,
    });
  } catch (error: any) {
    console.error("Error updating discount:", error);

    if (error.message === "Discount not found") {
      res.status(404).json({
        success: false,
        message: "Discount not found",
      });
      return;
    }

    if (error.message === "Discount code already exists") {
      res.status(400).json({
        success: false,
        message: "Discount code already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update discount",
    });
  }
}

// DELETE /api/admin/discounts/:id
export async function removeDiscount(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid discount ID",
      });
      return;
    }

    const result = await deleteDiscount(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error deleting discount:", error);

    if (error.message === "Discount not found") {
      res.status(404).json({
        success: false,
        message: "Discount not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete discount",
    });
  }
}
