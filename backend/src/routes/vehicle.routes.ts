import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public / View Endpoints
router.get('/search', VehicleController.searchVehicles);
router.get('/', VehicleController.getAllVehicles);
router.get('/:id', VehicleController.getVehicleById);

// Protected Vehicle Management Endpoints
router.post('/', authenticateToken, requireRole([Role.ADMIN]), VehicleController.createVehicle);
router.put('/:id', authenticateToken, requireRole([Role.ADMIN]), VehicleController.updateVehicle);
router.delete('/:id', authenticateToken, requireRole([Role.ADMIN]), VehicleController.deleteVehicle);

// Inventory Management Endpoints (Purchase & Restock)
router.post('/:id/purchase', authenticateToken, InventoryController.purchaseVehicle);
router.post('/:id/restock', authenticateToken, requireRole([Role.ADMIN]), InventoryController.restockVehicle);

// My Orders — logged in user's purchase history
router.get('/my-orders/list', authenticateToken, InventoryController.getMyOrders);

// Admin Orders — all customer purchases & dispatch management
router.get('/admin/orders', authenticateToken, requireRole([Role.ADMIN]), InventoryController.getAllOrdersForAdmin);

export default router;


