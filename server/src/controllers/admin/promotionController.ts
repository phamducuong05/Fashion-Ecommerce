import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';
import prisma from '../../utils/prisma';

export class PromotionController {
  static async getPromotions(req: Request, res: Response) {
    const promotions = await DataService.getPromotions();
    res.json(promotions);
  }

  // ==================== DISCOUNTS (Vouchers) ====================

  /**
   * GET /api/admin/discounts
   * Get all discounts/vouchers formatted for frontend
   */
  static async getDiscounts(req: Request, res: Response) {
    try {
      const vouchers = await (prisma as any).voucher.findMany({
        orderBy: { id: 'desc' }
      });

      const discounts = vouchers.map((v: any) => ({
        id: v.id,
        code: v.code,
        description: v.description || '',
        percentOff: v.type === 'PERCENT' ? Number(v.value) : 0,
        fixedAmount: v.type === 'FIXED' ? Number(v.value) : 0,
        type: v.type,
        stock: v.stock,
        usedCount: v.usedCount,
        startDate: v.startDate,
        endDate: v.endDate,
        active: v.isActive,
      }));

      res.json(discounts);
    } catch (error: any) {
      console.error('Error getting discounts:', error);
      res.status(500).json({ message: 'Failed to get discounts', error: error.message });
    }
  }

  /**
   * POST /api/admin/discounts
   * Create a new discount/voucher
   * Body: { code, description, percentOff, stock, startDate, endDate, active }
   */
  static async createDiscount(req: Request, res: Response) {
    try {
      const { code, description, percentOff, stock, startDate, endDate, active } = req.body;

      const voucher = await (prisma as any).voucher.create({
        data: {
          code: code.toUpperCase(),
          description: description || '',
          value: percentOff || 0,
          type: 'PERCENT',
          stock: stock || 0,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive: active ?? true,
        }
      });

      res.status(201).json({
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        percentOff: Number(voucher.value),
        stock: voucher.stock,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        active: voucher.isActive,
      });
    } catch (error: any) {
      console.error('Error creating discount:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Discount code already exists' });
      }
      res.status(500).json({ message: 'Failed to create discount', error: error.message });
    }
  }

  /**
   * PUT /api/admin/discounts/:id
   * Update an existing discount/voucher
   */
  static async updateDiscount(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { code, description, percentOff, stock, startDate, endDate, active } = req.body;

      const existing = await (prisma as any).voucher.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: 'Discount not found' });
      }

      const voucher = await (prisma as any).voucher.update({
        where: { id },
        data: {
          code: code?.toUpperCase() || existing.code,
          description: description ?? existing.description,
          value: percentOff ?? Number(existing.value),
          stock: stock ?? existing.stock,
          startDate: startDate ? new Date(startDate) : existing.startDate,
          endDate: endDate ? new Date(endDate) : existing.endDate,
          isActive: active ?? existing.isActive,
        }
      });

      res.json({
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        percentOff: Number(voucher.value),
        stock: voucher.stock,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        active: voucher.isActive,
      });
    } catch (error: any) {
      console.error('Error updating discount:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Discount code already exists' });
      }
      res.status(500).json({ message: 'Failed to update discount', error: error.message });
    }
  }

  /**
   * DELETE /api/admin/discounts/:id
   * Delete a discount/voucher
   */
  static async deleteDiscount(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const existing = await (prisma as any).voucher.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: 'Discount not found' });
      }

      await (prisma as any).voucher.delete({ where: { id } });

      res.json({ message: 'Discount deleted successfully', id });
    } catch (error: any) {
      console.error('Error deleting discount:', error);
      res.status(500).json({ message: 'Failed to delete discount', error: error.message });
    }
  }

  // ==================== BANNERS ====================

  /**
   * GET /api/admin/banners
   * Get all banners
   */
  static async getBanners(req: Request, res: Response) {
    try {
      const banners = await (prisma as any).banner.findMany({
        orderBy: { createdAt: 'desc' }
      });

      const formatted = banners.map((b: any) => ({
        id: String(b.id),
        title: b.title,
        subtitle: b.subtitle || '',
        imageUrl: b.imageUrl,
        active: b.isActive,
      }));

      res.json(formatted);
    } catch (error: any) {
      console.error('Error getting banners:', error);
      res.status(500).json({ message: 'Failed to get banners', error: error.message });
    }
  }

  /**
   * POST /api/admin/banners
   * Create a new banner
   * Body: { title, subtitle, imageUrl, active }
   */
  static async createBanner(req: Request, res: Response) {
    try {
      const { title, subtitle, imageUrl, active } = req.body;

      const banner = await (prisma as any).banner.create({
        data: {
          title,
          subtitle: subtitle || '',
          imageUrl,
          isActive: active ?? true,
        }
      });

      res.status(201).json({
        id: String(banner.id),
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        active: banner.isActive,
      });
    } catch (error: any) {
      console.error('Error creating banner:', error);
      res.status(500).json({ message: 'Failed to create banner', error: error.message });
    }
  }

  /**
   * PUT /api/admin/banners/:id
   * Update an existing banner
   */
  static async updateBanner(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { title, subtitle, imageUrl, active } = req.body;

      const existing = await (prisma as any).banner.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: 'Banner not found' });
      }

      const banner = await (prisma as any).banner.update({
        where: { id },
        data: {
          title: title ?? existing.title,
          subtitle: subtitle ?? existing.subtitle,
          imageUrl: imageUrl ?? existing.imageUrl,
          isActive: active ?? existing.isActive,
        }
      });

      res.json({
        id: String(banner.id),
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        active: banner.isActive,
      });
    } catch (error: any) {
      console.error('Error updating banner:', error);
      res.status(500).json({ message: 'Failed to update banner', error: error.message });
    }
  }

  /**
   * DELETE /api/admin/banners/:id
   * Delete a banner
   */
  static async deleteBanner(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const existing = await (prisma as any).banner.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: 'Banner not found' });
      }

      await (prisma as any).banner.delete({ where: { id } });

      res.json({ message: 'Banner deleted successfully', id });
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      res.status(500).json({ message: 'Failed to delete banner', error: error.message });
    }
  }
}
