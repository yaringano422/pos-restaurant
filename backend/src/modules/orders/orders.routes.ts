import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new OrdersController();

router.use(authenticate);

router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.post('/:id/items', (req, res) => controller.addItems(req, res));
router.post('/:id/pay', (req, res) => controller.pay(req, res));
router.patch('/:id/status', (req, res) => controller.updateStatus(req, res));
router.post('/:id/cancel', (req, res) => controller.cancel(req, res));

export default router;
