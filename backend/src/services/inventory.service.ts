import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { TransactionType } from '@prisma/client';

export class InventoryService {
  static async purchaseVehicle(userId: string, vehicleId: string, quantity: number = 1) {
    if (quantity <= 0) {
      throw new AppError('Quantity must be greater than zero', 400);
    }

    return await prisma.$transaction(async (tx: any) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      if (vehicle.quantity < quantity) {
        throw new AppError('Vehicle is out of stock', 400);
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
          type: TransactionType.PURCHASE,
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

  static async restockVehicle(userId: string, vehicleId: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError('Restock quantity must be greater than zero', 400);
    }

    return await prisma.$transaction(async (tx: any) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
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
          type: TransactionType.RESTOCK,
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
