"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_controller_1 = require("../controllers/vehicle.controller");
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Public / View Endpoints
router.get('/search', vehicle_controller_1.VehicleController.searchVehicles);
router.get('/', vehicle_controller_1.VehicleController.getAllVehicles);
router.get('/:id', vehicle_controller_1.VehicleController.getVehicleById);
// Protected Vehicle Management Endpoints
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)([client_1.Role.ADMIN]), vehicle_controller_1.VehicleController.createVehicle);
router.put('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)([client_1.Role.ADMIN]), vehicle_controller_1.VehicleController.updateVehicle);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)([client_1.Role.ADMIN]), vehicle_controller_1.VehicleController.deleteVehicle);
// Inventory Management Endpoints (Purchase & Restock)
router.post('/:id/purchase', auth_middleware_1.authenticateToken, inventory_controller_1.InventoryController.purchaseVehicle);
router.post('/:id/restock', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)([client_1.Role.ADMIN]), inventory_controller_1.InventoryController.restockVehicle);
exports.default = router;
