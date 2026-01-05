import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';

export class OrderController {
  static async listOrders(req: Request, res: Response) {
    const orders = await DataService.getOrders();
    res.json(orders);
  }

  static async getOrder(req: Request, res: Response) {
    const id = String(req.params.id);
    const order = await DataService.getOrderById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled', 'returned'];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ 
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }

      const order = await DataService.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Order status updated', order });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: error.message || 'Error updating order status' });
    }
  }
}
