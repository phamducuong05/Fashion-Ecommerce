// Quick validation script: ensure admin API data matches the JSON files in /data
// Run with: npx ts-node scripts/validateData.ts

process.env.DATABASE_URL = ""; // force AdminDataService to fall back to JSON files

import { AdminDataService } from "../src/services/adminDataService";
import fs from "fs";
import path from "path";
import assert from "assert";

const dataDir = path.join(__dirname, "../data");

function readFileJSON(file: string) {
  const p = path.join(dataDir, file);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

async function validate() {
  console.log("Validating admin data against /data JSON files...");

  // Products
  const productsFromApi = await AdminDataService.getProducts();
  const productsFile = readFileJSON("product.json");
  try {
    assert.deepStrictEqual(productsFromApi, productsFile);
    console.log("[OK] /products matches product.json");
  } catch (e) {
    console.error("[MISMATCH] /products does not match product.json");
    console.error(e);
  }

  // Customers
  const customersFromApi = await AdminDataService.getCustomers();
  const customersFile = readFileJSON("customer.json");
  try {
    assert.deepStrictEqual(customersFromApi, customersFile);
    console.log("[OK] /customers matches customer.json");
  } catch (e) {
    console.error("[MISMATCH] /customers does not match customer.json");
    console.error(e);
  }

  // Orders
  const ordersFromApi = await AdminDataService.getOrders();
  const ordersFile = readFileJSON("order.json");
  try {
    assert.deepStrictEqual(ordersFromApi, ordersFile);
    console.log("[OK] /orders matches order.json");
  } catch (e) {
    console.error("[MISMATCH] /orders does not match order.json");
    console.error(e);
  }

  // Promotions
  const promosFromApi = await AdminDataService.getPromotions();
  const promosFile = readFileJSON("promotion.json");
  try {
    assert.deepStrictEqual(promosFromApi, promosFile);
    console.log("[OK] /promotions matches promotion.json");
  } catch (e) {
    console.error("[MISMATCH] /promotions does not match promotion.json");
    console.error(e);
  }

  // Dashboard
  const dashFromApi = await AdminDataService.getDashboard();
  const dashFile = readFileJSON("dashboard.json");
  try {
    assert.deepStrictEqual(dashFromApi, dashFile);
    console.log("[OK] /dashboard matches dashboard.json");
  } catch (e) {
    console.error("[MISMATCH] /dashboard does not match dashboard.json");
    console.error(e);
  }

  // Chat
  const chatFromApi = await AdminDataService.getChat();
  const chatFile = readFileJSON("chat.json");
  try {
    assert.deepStrictEqual(chatFromApi, chatFile);
    console.log("[OK] /chat matches chat.json");
  } catch (e) {
    console.error("[MISMATCH] /chat does not match chat.json");
    console.error(e);
  }

  console.log("Validation complete. If any mismatches appeared, check the logs above.");
}

validate().catch((err) => {
  console.error(err);
  process.exit(1);
});
