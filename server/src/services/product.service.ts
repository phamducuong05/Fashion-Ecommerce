import { prisma } from "../config/database";
import { Prisma } from "@prisma/client";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string[];
  sections: string[];
  color: string;
  size: string;
}

const getColorCode = (colorName: string): string => {
  const normalizedColor = colorName.toLowerCase().trim();
  const map: Record<string, string> = {
    gray: "#808080",
    black: "#000000",
    blue: "#0000FF",
    "light gray": "#D3D3D3",
    "dark blue": "#00008B",
    white: "#FFFFFF",
    brown: "#A52A2A",
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

// Define the type for getAllProducts query result
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { categories: true; variants: true };
}>;

interface GetProductsParams {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string; // Could be array ideally, but string for simple single select
  cat?: string; // Category Filter (optional, existing functionality might need review if handled via route)
  sort?: string;
}

export const getAllProducts = async (params: GetProductsParams = {}): Promise<ProductSummary[]> => {
  const { keyword, minPrice, maxPrice, color, sort } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (color) {
    where.variants = {
      some: {
        color: {
          equals: color,
          mode: "insensitive",
        },
      },
    };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  if (sort) {
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "best_selling":
        orderBy = { sold: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }
  }

  const rawProducts: ProductWithRelations[] = await prisma.product.findMany({
    where,
    include: {
      categories: true,
      variants: true,
    },
    orderBy,
  });

  return rawProducts.map((product: ProductWithRelations) => {
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
      sections: sections,
      color: representativeVariant ? representativeVariant.color : "Free",
      size: representativeVariant ? representativeVariant.size : "Free",
    };
  });
};

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  thumbnail: string; // Added field
  category: string[];
  variants: {
    id: number;
    color: string;
    colorCode: string;
    size: string;
    stock: number;
    image: string | null;
  }[];
}

export const getProductById = async (id: string): Promise<ProductDetail | null> => {
  const product: ProductWithRelations | null = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { categories: true, variants: true },
  });

  if (!product) return null;

  return {
    id: product.id.toString(),
    name: product.name,
    price: Number(product.price),
    originalPrice: Number(product.originalPrice),
    rating: Number(product.rating),
    reviewCount: Number(product.reviewCount),
    description: product.description || "",
    thumbnail: product.thumbnail || "", // Added mapping
    category: product.categories.map((cat) => cat.name),
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
