"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
class VehicleService {
    static async createVehicle(dto) {
        if (!dto.vin || !dto.make || !dto.model || !dto.category || dto.price === undefined || dto.quantity === undefined) {
            throw new error_middleware_1.AppError('VIN, make, model, category, price, and quantity are required', 400);
        }
        const existing = await prisma_1.default.vehicle.findUnique({
            where: { vin: dto.vin },
        });
        if (existing) {
            throw new error_middleware_1.AppError('Vehicle with this VIN already exists', 400);
        }
        return await prisma_1.default.vehicle.create({
            data: dto,
        });
    }
    static async getAllVehicles() {
        return await prisma_1.default.vehicle.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    static async searchVehicles(filters) {
        const whereClause = {};
        if (filters.make) {
            whereClause.make = { contains: filters.make, mode: 'insensitive' };
        }
        if (filters.model) {
            whereClause.model = { contains: filters.model, mode: 'insensitive' };
        }
        if (filters.category) {
            whereClause.category = filters.category;
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            whereClause.price = {};
            if (filters.minPrice !== undefined) {
                whereClause.price.gte = Number(filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                whereClause.price.lte = Number(filters.maxPrice);
            }
        }
        if (filters.query) {
            whereClause.OR = [
                { make: { contains: filters.query, mode: 'insensitive' } },
                { model: { contains: filters.query, mode: 'insensitive' } },
                { vin: { contains: filters.query, mode: 'insensitive' } },
            ];
        }
        return await prisma_1.default.vehicle.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getVehicleById(id) {
        const vehicle = await prisma_1.default.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new error_middleware_1.AppError('Vehicle not found', 404);
        }
        return vehicle;
    }
    static async updateVehicle(id, dto) {
        await this.getVehicleById(id);
        return await prisma_1.default.vehicle.update({
            where: { id },
            data: dto,
        });
    }
    static async deleteVehicle(id) {
        await this.getVehicleById(id);
        return await prisma_1.default.vehicle.delete({
            where: { id },
        });
    }
}
exports.VehicleService = VehicleService;
