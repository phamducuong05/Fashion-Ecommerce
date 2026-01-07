import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';
import prisma from '../../utils/prisma';
import chatbotService from '../../services/user/chatbotService';

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

      // Find category by name or slug, create if not exists
      const categorySlug = createSlug(category);
      let categoryRecord = await (prisma as any).category.findFirst({
        where: { 
          OR: [
            { name: category },
            { slug: categorySlug }
          ]
        }
      });
      
      if (!categoryRecord) {
        // Create new category with unique slug
        categoryRecord = await (prisma as any).category.create({
          data: {
            name: category,
            slug: categorySlug + '-' + Date.now(), // Ensure unique slug
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
      
      // Auto-sync products to AI service
      chatbotService.syncProductsToAI().catch(err => {
        console.error('Failed to auto-sync products to AI:', err.message);
      });
      
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

      // Find category by name or slug, create if not exists
      const categorySlug = createSlug(category);
      let categoryRecord = await (prisma as any).category.findFirst({
        where: { 
          OR: [
            { name: category },
            { slug: categorySlug }
          ]
        }
      });
      
      if (!categoryRecord) {
        categoryRecord = await (prisma as any).category.create({
          data: {
            name: category,
            slug: categorySlug + '-' + Date.now(),
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

      // Update variants - smart upsert instead of delete all
      if (variants && Array.isArray(variants)) {
        // Get existing variants
        const existingVariants = await (prisma as any).productVariant.findMany({
          where: { productId: id },
          include: { orderItems: { take: 1 } } // Check if has orders
        });
        
        // Build new variant specs
        const newVariantSpecs: { size: string; color: string; image: string; stock: number }[] = [];
        for (const v of variants) {
          const colors = v.colors || [];
          for (const color of colors) {
            newVariantSpecs.push({
              size: v.size,
              color: color,
              image: v.imageUrl || image,
              stock: Math.floor((stock || 0) / (variants.length * colors.length)) || 10,
            });
          }
        }
        
        // Delete variants that are not in new specs AND have no orders
        for (const existing of existingVariants) {
          const stillNeeded = newVariantSpecs.some(
            spec => spec.size === existing.size && spec.color === existing.color
          );
          if (!stillNeeded && existing.orderItems.length === 0) {
            // Safe to delete - no orders reference this variant
            await (prisma as any).cartItem.deleteMany({ where: { variantId: existing.id } });
            await (prisma as any).productVariant.delete({ where: { id: existing.id } });
          } else if (!stillNeeded && existing.orderItems.length > 0) {
            // Can't delete - has orders. Set stock to 0 instead (soft disable)
            await (prisma as any).productVariant.update({
              where: { id: existing.id },
              data: { stock: 0 }
            });
          }
        }
        
        // Upsert new variants
        for (const spec of newVariantSpecs) {
          const existingMatch = existingVariants.find(
            (e: any) => e.size === spec.size && e.color === spec.color
          );
          if (existingMatch) {
            // Update existing
            await (prisma as any).productVariant.update({
              where: { id: existingMatch.id },
              data: { image: spec.image, stock: spec.stock }
            });
          } else {
            // Create new
            await (prisma as any).productVariant.create({
              data: {
                productId: id,
                size: spec.size,
                color: spec.color,
                sku: `${createSlug(name)}-${id}-${spec.size}-${spec.color}`.toUpperCase(),
                image: spec.image,
                stock: spec.stock,
              }
            });
          }
        }
      }

      // Return updated product
      const updated = await DataService.getProductById(id);
      
      // Auto-sync products to AI service
      chatbotService.syncProductsToAI().catch(err => {
        console.error('Failed to auto-sync products to AI:', err.message);
      });
      
      res.json(updated);
    } catch (error: any) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
  }

  /**
   * DELETE /api/admin/products/:id
   * Soft delete product (set isActive=false) or hard delete if no references
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      // Check product exists
      const existing = await (prisma as any).product.findUnique({ 
        where: { id },
        include: {
          reviews: { take: 1 },
          variants: {
            include: { orderItems: { take: 1 } }
          }
        }
      });
      if (!existing) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if product has reviews or any variant has orders
      const hasReviews = existing.reviews.length > 0;
      const hasOrders = existing.variants.some((v: any) => v.orderItems.length > 0);
      
      if (hasReviews || hasOrders) {
        // Soft delete - just deactivate the product
        await (prisma as any).product.update({
          where: { id },
          data: { isActive: false }
        });
        
        // Set all variant stocks to 0
        await (prisma as any).productVariant.updateMany({
          where: { productId: id },
          data: { stock: 0 }
        });
        
        res.json({ 
          message: 'Product deactivated (has order history or reviews)', 
          id,
          softDeleted: true 
        });
      } else {
        // Hard delete - no references, safe to delete
        // Delete cart items first
        const variantIds = existing.variants.map((v: any) => v.id);
        await (prisma as any).cartItem.deleteMany({ where: { variantId: { in: variantIds } } });
        
        // Delete variants
        await (prisma as any).productVariant.deleteMany({ where: { productId: id } });
        
        // Delete product
        await (prisma as any).product.delete({ where: { id } });
        
        res.json({ message: 'Product deleted permanently', id, softDeleted: false });
      }

      // Auto-sync products to AI service
      chatbotService.syncProductsToAI().catch(err => {
        console.error('Failed to auto-sync products to AI:', err.message);
      });

    } catch (error: any) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
  }
}
