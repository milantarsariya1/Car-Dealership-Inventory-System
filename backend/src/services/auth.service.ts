import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { Role } from '@prisma/client';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
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
        role: Role.USER, // Force all registrations to standard USER role
        phone: dto.phone || null,
        address: dto.address || null,
        city: dto.city || null,
        state: dto.state || null,
        pincode: dto.pincode || null,
        country: dto.country || 'India',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
      },
    };
  }

  static async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  }

  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    }
  ) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.country !== undefined) updateData.country = data.country;

    if (data.email && data.email !== userExists.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailTaken) {
        throw new AppError('Email is already taken by another account', 400);
      }
      updateData.email = data.email;
    }

    if (data.password && data.password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  static async updateUserByAdmin(
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: Role;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    }
  ) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      throw new AppError('Target user not found', 404);
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.country !== undefined) updateData.country = data.country;

    if (data.email && data.email !== userExists.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailTaken) {
        throw new AppError('Email is already in use by another user', 400);
      }
      updateData.email = data.email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
