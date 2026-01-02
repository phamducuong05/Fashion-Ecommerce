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
}
