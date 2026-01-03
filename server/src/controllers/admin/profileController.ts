import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import bcrypt from 'bcryptjs';

export class ProfileController {
  /**
   * GET /api/admin/profile
   * Get current admin profile information
   * Note: In a real app, this would use the authenticated user's ID from JWT
   * For now, we'll get the first ADMIN user
   */
  static async getProfile(req: Request, res: Response) {
    try {
      // In production, get admin ID from JWT token: req.user.id
      // For now, find the first admin user
      const admin = await (prisma as any).user.findFirst({
        where: { role: 'ADMIN' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      });

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      res.json({
        success: true,
        data: {
          id: String(admin.id),
          name: admin.name || '',
          email: admin.email,
          accountStatus: 'active',
          createdAt: admin.createdAt,
        }
      });
    } catch (error: any) {
      console.error('Error getting profile:', error);
      res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
    }
  }

  /**
   * PUT /api/admin/profile
   * Update admin profile (name and email)
   * Body: { name, email }
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }

      // Get current admin (in production, from JWT)
      const admin = await (prisma as any).user.findFirst({
        where: { role: 'ADMIN' }
      });

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      // Check if email already exists (if changing email)
      if (email && email !== admin.email) {
        const existingUser = await (prisma as any).user.findUnique({
          where: { email }
        });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already in use' });
        }
      }

      // Update profile
      const updated = await (prisma as any).user.update({
        where: { id: admin.id },
        data: {
          name: name ?? admin.name,
          email: email ?? admin.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: String(updated.id),
          name: updated.name,
          email: updated.email,
          accountStatus: 'active',
          createdAt: updated.createdAt,
        }
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
  }

  /**
   * POST /api/admin/change-password
   * Change admin password
   * Body: { currentPassword, newPassword }
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current password and new password are required' });
      }

      // Password strength validation
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }

      // Get current admin
      const admin = await (prisma as any).user.findFirst({
        where: { role: 'ADMIN' }
      });

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await (prisma as any).user.update({
        where: { id: admin.id },
        data: { password: hashedPassword }
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
    }
  }

  /**
   * DELETE /api/admin/account
   * Delete admin account
   * Body: { password } (optional, for confirmation)
   */
  static async deleteAccount(req: Request, res: Response) {
    try {
      const { password } = req.body;

      // Get current admin
      const admin = await (prisma as any).user.findFirst({
        where: { role: 'ADMIN' }
      });

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      // If password provided, verify it
      if (password) {
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
          return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }
      }

      // Delete admin account
      await (prisma as any).user.delete({
        where: { id: admin.id }
      });

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      res.status(500).json({ success: false, message: 'Failed to delete account', error: error.message });
    }
  }
}
