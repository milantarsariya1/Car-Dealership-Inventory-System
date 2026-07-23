import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const updatedUser = await AuthService.updateProfile(userId, req.body);
      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserByAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;
      const updatedUser = await AuthService.updateUserByAdmin(userId, req.body);
      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
