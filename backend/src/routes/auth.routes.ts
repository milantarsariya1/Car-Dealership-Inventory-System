import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', authenticateToken, requireRole([Role.ADMIN]), AuthController.getAllUsers);
router.put('/users/:id', authenticateToken, requireRole([Role.ADMIN]), AuthController.updateUserByAdmin);
router.put('/profile', authenticateToken, AuthController.updateProfile);

export default router;
