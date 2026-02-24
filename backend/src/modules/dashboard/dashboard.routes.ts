import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new DashboardController();

router.use(authenticate);
router.get('/summary', (req, res) => controller.getSummary(req, res));

export default router;
