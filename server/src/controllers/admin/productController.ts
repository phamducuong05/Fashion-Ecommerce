import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';
import prisma from '../../utils/prisma';

// Helper to create slug from name
function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export class ProductController {
  static async listProducts(req: Request, res: Response) {
    const products = await DataService.getProducts();
    res.json(products);
  }

  static async getProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    const product = await DataService.getProductById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  }

  /**
   * POST /api/admin/products
   * Create a new product with variants
   * Body: { name, category, price, stock, image, description, status, variants: [{ size, colors[], imageUrl }] }
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, category, price, stock, image, description, status, variants } = req.body;

      // Find or create category
      let categoryRecord = await (prisma as any).category.findFirst({
        where: { name: category }
      });
      
      if (!categoryRecord) {
        categoryRecord = await (prisma as any).category.create({
          data: {
            name: category,
            slug: createSlug(category),
          }
        });
      }

      // Create product
      const product = await (prisma as any).product.create({
        data: {
          name,
          slug: createSlug(name) + '-' + Date.now(),
          description: description || '',
          thumbnail: image,
          originalPrice: price,
          price: price,
          isActive: status === 'available',
          categories: { connect: { id: categoryRecord.id } }
        }
      });

      // Create variants from the UI format: { size, colors[], imageUrl }
      if (variants && Array.isArray(variants)) {
        for (const v of variants) {
          const colors = v.colors || [];
          for (const color of colors) {
            await (prisma as any).productVariant.create({
              data: {
                productId: product.id,
                size: v.size,
                color: color,
                sku: `${createSlug(name)}-${v.size}-${color}`.toUpperCase(),
                image: v.imageUrl || image,
                stock: Math.floor((stock || 0) / (variants.length * colors.length)) || 10,
              }
            });
          }
        }
      }

      // Return created product in UI format
      const created = await DataService.getProductById(product.id);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
  }

  /**
   * PUT /api/admin/products/:id
   * Update an existing product
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, category, price, stock, image, description, status, variants } = req.body;

      // Check product exists
      const existing = await (prisma as any).product.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Find or create category
      let categoryRecord = await (prisma as any).category.findFirst({
        where: { name: category }
      });
      
      if (!categoryRecord) {
        categoryRecord = await (prisma as any).category.create({
          data: {
            name: category,
            slug: createSlug(category),
          }
        });
      }

      // Update product
      await (prisma as any).product.update({
        where: { id },
        data: {
          name,
          description: description || existing.description,
          thumbnail: image || existing.thumbnail,
          price: price,
          isActive: status === 'available',
          categories: { set: [{ id: categoryRecord.id }] }
        }
      });

      // Delete old variants and create new ones
      if (variants && Array.isArray(variants)) {
        await (prisma as any).productVariant.deleteMany({ where: { productId: id } });
        
        for (const v of variants) {
          const colors = v.colors || [];
          for (const color of colors) {
            await (prisma as any).productVariant.create({
              data: {
                productId: id,
                size: v.size,
                color: color,
                sku: `${createSlug(name)}-${id}-${v.size}-${color}`.toUpperCase(),
                image: v.imageUrl || image,
                stock: Math.floor((stock || 0) / (variants.length * colors.length)) || 10,
              }
            });
          }
        }
      }

      // Return updated product
      const updated = await DataService.getProductById(id);
      res.json(updated);
    } catch (error: any) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
  }

  /**
   * DELETE /api/admin/products/:id
   * Delete a product and its variants
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      // Check product exists
      const existing = await (prisma as any).product.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Delete variants first (cascade should handle, but being explicit)
      await (prisma as any).productVariant.deleteMany({ where: { productId: id } });
      
      // Delete product
      await (prisma as any).product.delete({ where: { id } });

      res.json({ message: 'Product deleted successfully', id });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
  }
}
