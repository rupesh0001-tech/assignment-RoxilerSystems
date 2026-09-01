import { Response, NextFunction } from 'express';
import { adminService } from '../../services/admin/adminService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class AdminController {
  async getMetrics(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const metrics = await adminService.getPlatformMetrics();
      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, role, sortBy, sortOrder } = req.query;
      const users = await adminService.getAllUsers({
        search: search as string,
        role: role as any,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, address, role } = req.body;
      const user = await adminService.createUser({
        name,
        email,
        password,
        address,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, address, role, password } = req.body;
      const user = await adminService.updateUser(id, {
        name,
        email,
        address,
        role,
        password,
      });

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, address, ownerId } = req.body;
      const store = await adminService.updateStore(id, {
        name,
        email,
        address,
        ownerId,
      });

      res.status(200).json({
        success: true,
        message: 'Store updated successfully',
        data: store,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteStore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteStore(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
