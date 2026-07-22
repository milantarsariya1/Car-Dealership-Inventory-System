import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  static async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { make, model, category, minPrice, maxPrice, query } = req.query;
      const vehicles = await VehicleService.searchVehicles({
        make: make as string,
        model: model as string,
        category: category as any,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        query: query as string,
      });
      res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await VehicleService.updateVehicle(req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      await VehicleService.deleteVehicle(req.params.id as string);
      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
