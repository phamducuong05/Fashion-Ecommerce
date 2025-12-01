// src/routes/adminCustomerRoutes.ts
import { Router } from "express";
import { getCustomers } from "../controllers/adminCustomerController";

const router = Router();

// GET /api/admin/customers - Get all customers
router.get("/", getCustomers);

export default router;
