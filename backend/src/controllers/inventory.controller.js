"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
class InventoryController {
    static async purchaseVehicle(req, res, next) {
        try {
            const userId = req.user.id;
            const vehicleId = req.params.id;
            const quantity = req.body.quantity ? Number(req.body.quantity) : 1;
            const result = await inventory_service_1.InventoryService.purchaseVehicle(userId, vehicleId, quantity);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async restockVehicle(req, res, next) {
        try {
            const userId = req.user.id;
            const vehicleId = req.params.id;
            const quantity = Number(req.body.quantity);
            const result = await inventory_service_1.InventoryService.restockVehicle(userId, vehicleId, quantity);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InventoryController = InventoryController;
