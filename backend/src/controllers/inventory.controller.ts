import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { InventoryService } from '../services/inventory.service';

export class InventoryController {
  static async purchaseVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const vehicleId = req.params.id as string;
      const quantity = req.body.quantity ? Number(req.body.quantity) : 1;

      const result = await InventoryService.purchaseVehicle(userId, vehicleId, quantity);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async restockVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const vehicleId = req.params.id as string;
      const quantity = Number(req.body.quantity);

      const result = await InventoryService.restockVehicle(userId, vehicleId, quantity);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orders = await InventoryService.getUserOrders(userId);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrdersForAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await InventoryService.getAllOrdersForAdmin();
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
}



