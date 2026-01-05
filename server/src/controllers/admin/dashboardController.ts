import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';

export class DashboardController {
  static async getDashboard(req: Request, res: Response) {
    const dashboard = await DataService.getDashboard();
    res.json(dashboard);
  }
}
