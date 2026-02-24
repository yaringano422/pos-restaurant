import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/roles';

const router = Router();
const controller = new UsersController();

router.use(authenticate);

router.get('/', authorize('admin', 'manager'), (req, res) => controller.getAll(req, res));
router.get('/:id', authorize('admin', 'manager'), (req, res) => controller.getById(req, res));
router.put('/:id', authorize('admin', 'manager'), (req, res) => controller.update(req, res));
router.delete('/:id', authorize('admin'), (req, res) => controller.delete(req, res));

export default router;
