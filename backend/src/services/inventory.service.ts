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

    // Attach simulated dispatch/delivery status based on order age
    return orders.map((order: any) => {
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
    });
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

    return orders.map((order: any) => {
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
    });
  }
}

