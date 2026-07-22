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
}
