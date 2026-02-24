import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ProductsService } from './products.service';

const service = new ProductsService();

export class ProductsController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const products = await service.getAll(req.user!.branchId, categoryId);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await service.getById(req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await service.create(req.user!.branchId, req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await service.update(req.params.id, req.body);
      res.json(product);
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
