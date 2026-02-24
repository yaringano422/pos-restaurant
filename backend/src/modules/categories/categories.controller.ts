import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CategoriesService } from './categories.service';

const service = new CategoriesService();

export class CategoriesController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await service.getAll(req.user!.branchId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await service.create(req.user!.branchId, req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await service.update(req.params.id, req.body);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await service.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
