"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("../generated/client");
class InventoryService {
    static async purchaseVehicle(userId, vehicleId, quantity = 1) {
        if (quantity <= 0) {
            throw new error_middleware_1.AppError('Quantity must be greater than zero', 400);
        }
        return await prisma_1.default.$transaction(async (tx) => {
            const vehicle = await tx.vehicle.findUnique({
                where: { id: vehicleId },
            });
            if (!vehicle) {
                throw new error_middleware_1.AppError('Vehicle not found', 404);
            }
            if (vehicle.quantity < quantity) {
                throw new error_middleware_1.AppError('Vehicle is out of stock', 400);
            }
            // Update vehicle stock quantity
            const updatedVehicle = await tx.vehicle.update({
                where: { id: vehicleId },
                data: {
                    quantity: vehicle.quantity - quantity,
                },
            });
            // Create transaction record
            const totalPrice = vehicle.price * quantity;
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    vehicleId,
                    type: client_1.TransactionType.PURCHASE,
                    quantity,
                    unitPrice: vehicle.price,
                    totalPrice,
                },
            });
            return {
                vehicle: updatedVehicle,
                transaction,
            };
        });
    }
    static async restockVehicle(userId, vehicleId, quantity) {
        if (quantity <= 0) {
            throw new error_middleware_1.AppError('Restock quantity must be greater than zero', 400);
        }
        return await prisma_1.default.$transaction(async (tx) => {
            const vehicle = await tx.vehicle.findUnique({
                where: { id: vehicleId },
            });
            if (!vehicle) {
                throw new error_middleware_1.AppError('Vehicle not found', 404);
            }
            const updatedVehicle = await tx.vehicle.update({
                where: { id: vehicleId },
                data: {
                    quantity: vehicle.quantity + quantity,
                },
            });
            const totalPrice = vehicle.price * quantity;
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    vehicleId,
                    type: client_1.TransactionType.RESTOCK,
                    quantity,
                    unitPrice: vehicle.price,
                    totalPrice,
                },
            });
            return {
                vehicle: updatedVehicle,
                transaction,
            };
        });
    }
}
exports.InventoryService = InventoryService;
