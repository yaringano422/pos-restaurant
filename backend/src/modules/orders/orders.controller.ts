import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { OrdersService } from './orders.service';

const service = new OrdersService();

export class OrdersController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, date } = req.query;
      const orders = await service.getAll(req.user!.branchId, status as string, date as string);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await service.getById(req.params.id);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await service.create(req.user!.branchId, req.user!.id, req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addItems(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await service.addItems(req.params.id, req.user!.branchId, req.body.items);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async pay(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = { ...req.body, cashierId: req.user!.id };
      const order = await service.pay(req.params.id, data);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await service.updateStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await service.cancel(req.params.id, req.user!.branchId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
