// src/services/adminProductService.ts
import prisma from "../utils/prisma";

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to determine product status
function getProductStatus(
  isActive: boolean,
  totalStock: number
): "available" | "out_of_stock" | "discontinued" {
  if (!isActive) return "discontinued";
  if (totalStock <= 0) return "out_of_stock";
  return "available";
}

// Type definitions
type ProductWithRelations = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  originalPrice: any;
  price: any;
  discount: number;
  isActive: boolean;
  sold: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    image: string | null;
    parentId: number | null;
    parent: { id: number; name: string; slug: string; image: string | null; parentId: number | null } | null;
  }>;
  variants: Array<{
    id: number;
    productId: number;
    color: string;
    size: string;
    sku: string | null;
    image: string | null;
    stock: number;
  }>;
};

type VariantInput = {
  size: string;
  color: string;
  image: string | null;
  stock: number;
};

// GET /api/admin/products - Get all products
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    include: {
      categories: {
        include: {
          parent: true,
        },
      },
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data to match the required format
  return products.map((product: ProductWithRelations) => {
    // Calculate total stock from variants
    const totalStock = product.variants.reduce(
      (sum: number, variant: { stock: number }) => sum + variant.stock,
      0
    );

    // Build category string (e.g., "Men - T-Shirts")
    const categoryString = product.categories
      .map((cat: { name: string; parent: { name: string } | null }) => {
        if (cat.parent) {
          return `${cat.parent.name} - ${cat.name}`;
        }
        return cat.name;
      })
      .join(", ");

    // Group variants by size
    const variantsBySize: Record<string, { colors: string[]; imageUrl: string }> = {};
    
    product.variants.forEach((variant: { size: string; color: string; image: string | null }) => {
      if (!variantsBySize[variant.size]) {
        variantsBySize[variant.size] = {
          colors: [],
          imageUrl: variant.image || product.thumbnail || "",
        };
      }
      if (!variantsBySize[variant.size].colors.includes(variant.color)) {
        variantsBySize[variant.size].colors.push(variant.color);
      }
    });

    const variants = Object.entries(variantsBySize).map(([size, sizeData]) => ({
      size,
      colors: sizeData.colors,
      imageUrl: sizeData.imageUrl,
    }));

    return {
      id: product.id,
      name: product.name,
      category: categoryString,
      price: Number(product.price),
      stock: totalStock,
      image: product.thumbnail || "",
      description: product.description || "",
      status: getProductStatus(product.isActive, totalStock),
      variants,
    };
  });
}

// POST /api/admin/products - Create new product
export async function createProduct(data: {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  status: string;
  variants: { size: string; colors: string[]; imageUrl: string }[];
}) {
  const slug = generateSlug(data.name);

  // Parse category string (e.g., "Men - T-Shirts")
  const categoryParts = data.category.split(" - ").map((s) => s.trim());

  // Find or create category
  let categoryId: number | null = null;

  if (categoryParts.length === 2) {
    // Has parent category
    const [parentName, childName] = categoryParts;

    // Find or create parent
    let parent = await prisma.category.findFirst({
      where: { name: parentName, parentId: null },
    });

    if (!parent) {
      parent = await prisma.category.create({
        data: {
          name: parentName,
          slug: generateSlug(parentName),
        },
      });
    }

    // Find or create child
    let child = await prisma.category.findFirst({
      where: { name: childName, parentId: parent.id },
    });

    if (!child) {
      child = await prisma.category.create({
        data: {
          name: childName,
          slug: generateSlug(`${parentName}-${childName}`),
          parentId: parent.id,
        },
      });
    }

    categoryId = child.id;
  } else if (categoryParts.length === 1) {
    // Single category
    let category = await prisma.category.findFirst({
      where: { name: categoryParts[0] },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryParts[0],
          slug: generateSlug(categoryParts[0]),
        },
      });
    }

    categoryId = category.id;
  }

  // Create product
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      thumbnail: data.image,
      originalPrice: data.price,
      price: data.price,
      isActive: data.status !== "discontinued",
      categories: categoryId ? { connect: { id: categoryId } } : undefined,
    },
  });

  // Create variants
  const variantData: {
    productId: number;
    size: string;
    color: string;
    image: string;
    stock: number;
  }[] = [];

  for (const variant of data.variants) {
    const stockPerVariant = Math.floor(data.stock / (data.variants.length * variant.colors.length));

    for (const color of variant.colors) {
      variantData.push({
        productId: product.id,
        size: variant.size,
        color,
        image: variant.imageUrl,
        stock: stockPerVariant || 1,
      });
    }
  }

  await prisma.productVariant.createMany({
    data: variantData,
  });

  // Return created product in the expected format
  return {
    id: product.id,
    name: product.name,
    category: data.category,
    price: Number(product.price),
    stock: data.stock,
    image: product.thumbnail || "",
    description: product.description || "",
    status: data.status,
    variants: data.variants,
  };
}

// PUT /api/admin/products/:id - Update product
export async function updateProduct(
  id: number,
  data: {
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description: string;
    status: string;
    variants: { size: string; colors: string[]; imageUrl: string }[];
  }
) {
  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: { categories: true },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const slug = generateSlug(data.name);

  // Parse category string
  const categoryParts = data.category.split(" - ").map((s) => s.trim());

  let categoryId: number | null = null;

  if (categoryParts.length === 2) {
    const [parentName, childName] = categoryParts;

    let parent = await prisma.category.findFirst({
      where: { name: parentName, parentId: null },
    });

    if (!parent) {
      parent = await prisma.category.create({
        data: {
          name: parentName,
          slug: generateSlug(parentName),
        },
      });
    }

    let child = await prisma.category.findFirst({
      where: { name: childName, parentId: parent.id },
    });

    if (!child) {
      child = await prisma.category.create({
        data: {
          name: childName,
          slug: generateSlug(`${parentName}-${childName}`),
          parentId: parent.id,
        },
      });
    }

    categoryId = child.id;
  } else if (categoryParts.length === 1) {
    let category = await prisma.category.findFirst({
      where: { name: categoryParts[0] },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryParts[0],
          slug: generateSlug(categoryParts[0]),
        },
      });
    }

    categoryId = category.id;
  }

  // Update product - disconnect old categories first
  await prisma.product.update({
    where: { id },
    data: {
      categories: {
        set: [], // Disconnect all existing categories
      },
    },
  });

  // Update product with new data
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
      thumbnail: data.image,
      originalPrice: data.price,
      price: data.price,
      isActive: data.status !== "discontinued",
      categories: categoryId ? { connect: { id: categoryId } } : undefined,
    },
  });

  // Delete existing variants and create new ones
  await prisma.productVariant.deleteMany({
    where: { productId: id },
  });

  const variantData: {
    productId: number;
    size: string;
    color: string;
    image: string;
    stock: number;
  }[] = [];

  for (const variant of data.variants) {
    const stockPerVariant = Math.floor(data.stock / (data.variants.length * variant.colors.length));

    for (const color of variant.colors) {
      variantData.push({
        productId: id,
        size: variant.size,
        color,
        image: variant.imageUrl,
        stock: stockPerVariant || 1,
      });
    }
  }

  await prisma.productVariant.createMany({
    data: variantData,
  });

  return {
    id: updatedProduct.id,
    name: updatedProduct.name,
    category: data.category,
    price: Number(updatedProduct.price),
    stock: data.stock,
    image: updatedProduct.thumbnail || "",
    description: updatedProduct.description || "",
    status: data.status,
    variants: data.variants,
  };
}

// DELETE /api/admin/products/:id - Delete product and its variants
export async function deleteProduct(id: number) {
  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Delete product (variants will be cascade deleted due to onDelete: Cascade)
  await prisma.product.delete({
    where: { id },
  });

  return { id, deleted: true };
}
