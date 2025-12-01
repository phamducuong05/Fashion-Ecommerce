import { Request, Response } from "express";
import * as dashboardService from "../services/adminDashboardService";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const dashboardData = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error when take data in dashboard" 
    });
  }
};
