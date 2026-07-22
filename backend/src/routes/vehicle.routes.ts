import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '../generated/client';

const router = Router();

// Public / View Endpoints
router.get('/search', VehicleController.searchVehicles);
router.get('/', VehicleController.getAllVehicles);
router.get('/:id', VehicleController.getVehicleById);

// Protected Vehicle Management Endpoints
router.post('/', authenticateToken, requireRole([Role.ADMIN]), VehicleController.createVehicle);
router.put('/:id', authenticateToken, requireRole([Role.ADMIN]), VehicleController.updateVehicle);
router.delete('/:id', authenticateToken, requireRole([Role.ADMIN]), VehicleController.deleteVehicle);

export default router;
