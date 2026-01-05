import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';

export class CustomerController {
  static async listCustomers(req: Request, res: Response) {
    const customers = await DataService.getCustomers();
    res.json(customers);
  }

  static async getCustomer(req: Request, res: Response) {
    const id = Number(req.params.id);
    const customers = await DataService.getCustomers();
    const customer = customers.find((c) => c.id === id || c.id === String(id));
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  }
}
