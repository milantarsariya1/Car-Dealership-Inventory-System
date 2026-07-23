import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { Category, Prisma } from '@prisma/client';

export interface CreateVehicleDTO {
  vin: string;
  make: string;
  model: string;
  category: Category;
  price: number;
  quantity: number;
  imageUrl?: string;
  description?: string;
}

export interface UpdateVehicleDTO {
  vin?: string;
  make?: string;
  model?: string;
  category?: Category;
  price?: number;
  quantity?: number;
  imageUrl?: string;
  description?: string;
}

export interface SearchVehicleFilters {
  make?: string;
  model?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

/**
 * Shared field-level validation for create and update payloads.
 * Rejects negative prices, negative/fractional quantities, and unknown categories.
 */
const validateVehicleFields = (dto: UpdateVehicleDTO) => {
  if (dto.price !== undefined && (typeof dto.price !== 'number' || Number.isNaN(dto.price) || dto.price < 0)) {
    throw new AppError('Price must be a non-negative number', 400);
  }

  if (dto.quantity !== undefined && (!Number.isInteger(dto.quantity) || dto.quantity < 0)) {
    throw new AppError('Quantity must be a non-negative whole number', 400);
  }

  if (dto.category !== undefined && !Object.values(Category).includes(dto.category)) {
    throw new AppError(`Category must be one of: ${Object.values(Category).join(', ')}`, 400);
  }
};

export class VehicleService {
  static async createVehicle(dto: CreateVehicleDTO) {
    if (!dto.vin || !dto.make || !dto.model || !dto.category || dto.price === undefined || dto.quantity === undefined) {
      throw new AppError('VIN, make, model, category, price, and quantity are required', 400);
    }

    validateVehicleFields(dto);

    const existing = await prisma.vehicle.findUnique({
      where: { vin: dto.vin },
    });

    if (existing) {
      throw new AppError('Vehicle with this VIN already exists', 400);
    }

    return await prisma.vehicle.create({
      data: dto,
    });
  }

  static async getAllVehicles() {
    return await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async searchVehicles(filters: SearchVehicleFilters) {
    const whereClause: Prisma.VehicleWhereInput = {};

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
      whereClause.price = {
        ...(filters.minPrice !== undefined && { gte: Number(filters.minPrice) }),
        ...(filters.maxPrice !== undefined && { lte: Number(filters.maxPrice) }),
      };
    }

    if (filters.query) {
      whereClause.OR = [
        { make: { contains: filters.query, mode: 'insensitive' } },
        { model: { contains: filters.query, mode: 'insensitive' } },
        { vin: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    return await prisma.vehicle.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getVehicleById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    return vehicle;
  }

  static async updateVehicle(id: string, dto: UpdateVehicleDTO) {
    validateVehicleFields(dto);
    await this.getVehicleById(id);

    return await prisma.vehicle.update({
      where: { id },
      data: dto,
    });
  }

  static async deleteVehicle(id: string) {
    await this.getVehicleById(id);

    return await prisma.vehicle.delete({
      where: { id },
    });
  }
}
