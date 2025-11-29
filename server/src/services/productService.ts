// src/services/productService.ts
import prisma from "../utils/prisma";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string[];
  section: string[];
  color: string;
  size: string;
}

const getColorCode = (colorName: string): string => {
  // Chuyển hết về chữ thường và bỏ khoảng trắng thừa để so sánh cho chuẩn
  // Ví dụ: "Black" -> "black", " Light Gray " -> "light gray"
  const normalizedColor = colorName.toLowerCase().trim();

  const map: Record<string, string> = {
    gray: "#808080", // Xám chuẩn
    black: "#000000", // Đen
    blue: "#0000FF", // Xanh dương
    "light gray": "#D3D3D3", // Xám nhạt
    "dark blue": "#00008B", // Xanh dương đậm
    white: "#FFFFFF", // Trắng
    brown: "#A52A2A", // Nâu

    // --- Các màu phổ biến khác (Dự phòng cho tương lai) ---
    red: "#FF0000",
    green: "#008000",
    yellow: "#FFFF00",
    navy: "#000080",
    beige: "#F5F5DC",
    pink: "#FFC0CB",
    purple: "#800080",
  };

  return map[normalizedColor] || "#CCCCCC";
};

export const getAllProducts = async (): Promise<ProductSummary[]> => {
  const rawProducts = await prisma.product.findMany({
    include: {
      categories: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedData = rawProducts.map((product) => {
    const representativeVariant = product.variants[0];
    const sections: string[] = [];

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (new Date(product.createdAt) > oneYearAgo) sections.push("new");
    if (product.discount > 0) sections.push("sale");
    if (product.sold > 100) sections.push("best seller");

    return {
      id: product.id.toString(),
      name: product.name,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice),
      image: product.thumbnail || "",
      category: product.categories.map((cat) => cat.name),
      section: sections,
      color: representativeVariant ? representativeVariant.color : "Free",
      size: representativeVariant ? representativeVariant.size : "Free",
    };
  });

  return formattedData;
};

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  variants: {
    id: number;
    color: string;
    colorCode: string;
    size: string;
    stock: number;
    image: string | null;
  }[];
}

// 2. Hàm lấy chi tiết sản phẩm
export const getProductById = async (
  id: string
): Promise<ProductDetail | null> => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      categories: true,
      variants: true,
    },
  });

  if (!product) return null;

  return {
    id: product.id.toString(),
    name: product.name,
    price: Number(product.price),
    rating: Number(product.rating),
    reviewCount: Number(product.reviewCount),
    description: product.description || "",
    variants: product.variants.map((v) => ({
      id: v.id,
      color: v.color,
      colorCode: getColorCode(v.color),
      size: v.size,
      stock: v.stock,
      image: v.image,
    })),
  };
};
