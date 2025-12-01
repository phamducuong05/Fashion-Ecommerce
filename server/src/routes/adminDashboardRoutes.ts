import { Router } from "express";
import { getDashboard } from "../controllers/adminDashboardController";

const router = Router();

// GET /api/admin/dashboard
router.get("/", getDashboard);

export default router;
