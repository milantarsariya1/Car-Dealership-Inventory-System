import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { Role } from '../generated/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  try {
    const secret = process.env.JWT_SECRET || 'car_dealership_super_secret_key_2026';
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: Role;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token.', 401));
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient privileges.', 403));
    }
    next();
  };
};
