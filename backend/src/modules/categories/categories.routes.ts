import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/roles';

const router = Router();
const controller = new CategoriesController();

router.use(authenticate);

router.get('/', (req, res) => controller.getAll(req, res));
router.post('/', authorize('admin', 'manager'), (req, res) => controller.create(req, res));
router.put('/:id', authorize('admin', 'manager'), (req, res) => controller.update(req, res));
router.delete('/:id', authorize('admin'), (req, res) => controller.delete(req, res));

export default router;
