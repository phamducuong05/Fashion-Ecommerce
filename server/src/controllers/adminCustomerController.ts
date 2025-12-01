// src/controllers/adminCustomerController.ts
import { Request, Response } from "express";
import { getAllCustomers } from "../services/adminCustomerService";

// GET /api/admin/customers
export async function getCustomers(req: Request, res: Response) {
  try {
    const customers = await getAllCustomers();
    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
}
