import { Router } from 'express';
import { TablesController } from './tables.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/roles';

const router = Router();
const controller = new TablesController();

router.use(authenticate);

router.get('/', (req, res) => controller.getAll(req, res));
router.post('/', authorize('admin', 'manager'), (req, res) => controller.create(req, res));
router.put('/:id', authorize('admin', 'manager'), (req, res) => controller.update(req, res));
router.patch('/:id/status', (req, res) => controller.updateStatus(req, res));
router.delete('/:id', authorize('admin'), (req, res) => controller.delete(req, res));

export default router;
