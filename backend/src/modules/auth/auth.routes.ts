import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), (req, res) => controller.login(req, res));
router.post('/register', authenticate, validate(registerSchema), (req, res) => controller.register(req, res));
router.get('/profile', authenticate, (req, res) => controller.getProfile(req, res));

export default router;
