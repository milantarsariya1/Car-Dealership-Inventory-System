import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { Prisma, Transaction, TransactionType } from '@prisma/client';

/**
 * Simulated dispatch tracking derived from the order's age.
 * Kept in one place so user and admin order views stay consistent.
 */
const withDispatchStatus = <T extends Pick<Transaction, 'createdAt'>>(order: T) => {
  const ageMs = Date.now() - new Date(order.createdAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);

  let dispatchStatus: string;
  let estimatedDelivery: string;

  if (ageHours < 1) {
    dispatchStatus = 'ORDER_CONFIRMED';
    estimatedDelivery = '5-7 Business Days';
  } else if (ageHours < 24) {
    dispatchStatus = 'PROCESSING';
    estimatedDelivery = '4-6 Business Days';
  } else if (ageHours < 72) {
    dispatchStatus = 'DISPATCHED';
    estimatedDelivery = '2-4 Business Days';
  } else {
    dispatchStatus = 'OUT_FOR_DELIVERY';
    estimatedDelivery = 'Arriving Soon';
  }

  return {
    ...order,
    dispatchStatus,
    estimatedDelivery,
  };
};

export class InventoryService {
  static async purchaseVehicle(userId: string, vehicleId: string, quantity: number = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new AppError('Quantity must be a positive whole number', 400);
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      // Atomic conditional decrement: the WHERE clause guarantees stock can
      // never go negative, even under concurrent purchase requests.
      const updated = await tx.vehicle.updateMany({
        where: { id: vehicleId, quantity: { gte: quantity } },
        data: { quantity: { decrement: quantity } },
      });

      if (updated.count === 0) {
        throw new AppError('Vehicle is out of stock', 400);
      }

      const updatedVehicle = await tx.vehicle.findUniqueOrThrow({
        where: { id: vehicleId },
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
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new AppError('Restock quantity must be a positive whole number', 400);
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      const updatedVehicle = await tx.vehicle.update({
        where: { id: vehicleId },
        data: {
          quantity: { increment: quantity },
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

  static async getUserOrders(userId: string) {
    const orders = await prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.PURCHASE,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            category: true,
            imageUrl: true,
            description: true,
            vin: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map(withDispatchStatus);
  }

  static async getAllOrdersForAdmin() {
    const orders = await prisma.transaction.findMany({
      where: {
        type: TransactionType.PURCHASE,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            country: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            category: true,
            imageUrl: true,
            vin: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map(withDispatchStatus);
  }
}
