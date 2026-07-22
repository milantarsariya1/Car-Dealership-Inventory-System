import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { Role } from '../generated/client';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  static async register(dto: RegisterDTO) {
    if (!dto.email || !dto.password || !dto.name) {
      throw new AppError('Name, email, and password are required', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: passwordHash,
        role: dto.role || Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async login(dto: LoginDTO) {
    if (!dto.email || !dto.password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const secret = process.env.JWT_SECRET || 'car_dealership_super_secret_key_2026';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
