import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', authenticateToken, requireRole([Role.ADMIN]), AuthController.getAllUsers);

export default router;
