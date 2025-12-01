// src/controllers/adminOrderController.ts
import { Request, Response } from "express";
import { getAllOrders, updateOrderStatus } from "../services/adminOrderService";

// GET /api/admin/orders
export async function getOrders(req: Request, res: Response) {
  try {
    const orders = await getAllOrders();
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}

// PUT /api/admin/orders/:id
export async function editOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!status) {
      res.status(400).json({
        success: false,
        message: "Missing required field: status",
      });
      return;
    }

    const updatedOrder = await updateOrderStatus(id, status);

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order status:", error);

    if (error.message === "Order not found") {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (error.message === "Invalid order ID") {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    if (error.message.startsWith("Invalid status")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
}
