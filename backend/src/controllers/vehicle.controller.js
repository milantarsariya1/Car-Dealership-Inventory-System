"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const vehicle_service_1 = require("../services/vehicle.service");
class VehicleController {
    static async createVehicle(req, res, next) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.createVehicle(req.body);
            res.status(201).json({
                success: true,
                data: vehicle,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllVehicles(req, res, next) {
        try {
            const vehicles = await vehicle_service_1.VehicleService.getAllVehicles();
            res.status(200).json({
                success: true,
                data: vehicles,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async searchVehicles(req, res, next) {
        try {
            const { make, model, category, minPrice, maxPrice, query } = req.query;
            const vehicles = await vehicle_service_1.VehicleService.searchVehicles({
                make: make,
                model: model,
                category: category,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                query: query,
            });
            res.status(200).json({
                success: true,
                data: vehicles,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getVehicleById(req, res, next) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.getVehicleById(req.params.id);
            res.status(200).json({
                success: true,
                data: vehicle,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateVehicle(req, res, next) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.updateVehicle(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: vehicle,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteVehicle(req, res, next) {
        try {
            await vehicle_service_1.VehicleService.deleteVehicle(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Vehicle deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.VehicleController = VehicleController;
