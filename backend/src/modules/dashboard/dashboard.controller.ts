import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { DashboardService } from './dashboard.service';

const service = new DashboardService();

export class DashboardController {
  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const summary = await service.getSummary(req.user!.branchId);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
