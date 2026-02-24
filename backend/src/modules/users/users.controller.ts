import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { UsersService } from './users.service';

const service = new UsersService();

export class UsersController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await service.getAll(req.user!.branchId);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await service.getById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await service.update(req.params.id, req.body);
      res.json(user);
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
