// src/services/adminDiscountService.ts
import prisma from "../utils/prisma";

// Helper function to format date
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// GET /api/admin/discounts - Get all discounts
export async function getAllDiscounts() {
  const vouchers = await prisma.voucher.findMany({
    orderBy: {
      id: "desc",
    },
  });

  // Transform data to match the required format
  return vouchers.map((voucher: any) => ({
    id: voucher.id,
    code: voucher.code,
    description: voucher.code, // Using code as description since schema doesn't have description field
    percentOff: Number(voucher.value),
    "available-stock": voucher.stock,
    startDate: formatDate(voucher.startDate),
    endDate: formatDate(voucher.endDate),
    active: voucher.isActive,
  }));
}

// POST /api/admin/discounts - Create new discount
export async function createDiscount(data: {
  code: string;
  description: string;
  percentOff: number;
  stock: number;
  startDate: string;
  endDate: string;
  active: boolean;
}) {
  const voucher = await prisma.voucher.create({
    data: {
      code: data.code,
      value: data.percentOff,
      stock: data.stock,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.active,
    },
  });

  return {
    id: voucher.id,
    code: voucher.code,
    description: data.description,
    percentOff: Number(voucher.value),
    "available-stock": voucher.stock,
    startDate: formatDate(voucher.startDate),
    endDate: formatDate(voucher.endDate),
    active: voucher.isActive,
  };
}

// PUT /api/admin/discounts/:id - Update discount
export async function updateDiscount(
  id: number,
  data: {
    code: string;
    description: string;
    percentOff: number;
    stock: number;
    startDate: string;
    endDate: string;
    active: boolean;
  }
) {
  // Check if discount exists
  const existingVoucher = await prisma.voucher.findUnique({
    where: { id },
  });

  if (!existingVoucher) {
    throw new Error("Discount not found");
  }

  // Check if code is being changed and if it's already taken
  if (data.code && data.code !== existingVoucher.code) {
    const codeExists = await prisma.voucher.findUnique({
      where: { code: data.code },
    });
    if (codeExists) {
      throw new Error("Discount code already exists");
    }
  }

  const voucher = await prisma.voucher.update({
    where: { id },
    data: {
      code: data.code,
      value: data.percentOff,
      stock: data.stock,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.active,
    },
  });

  return {
    id: voucher.id,
    code: voucher.code,
    description: data.description,
    percentOff: Number(voucher.value),
    "available-stock": voucher.stock,
    startDate: formatDate(voucher.startDate),
    endDate: formatDate(voucher.endDate),
    active: voucher.isActive,
  };
}

// DELETE /api/admin/discounts/:id - Delete discount
export async function deleteDiscount(id: number) {
  // Check if discount exists
  const existingVoucher = await prisma.voucher.findUnique({
    where: { id },
  });

  if (!existingVoucher) {
    throw new Error("Discount not found");
  }

  await prisma.voucher.delete({
    where: { id },
  });

  return { id, deleted: true };
}
