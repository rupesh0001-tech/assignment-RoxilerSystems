import { Request, Response, NextFunction } from 'express';
import { storeService } from '../../services/store/storeService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class StoreController {
  async getAllStores(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, sortBy, sortOrder } = req.query;
      const stores = await storeService.getAllStores({
        search: search as string,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        userId: req.user?.id,
      });

      res.status(200).json({
        success: true,
        data: stores,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStoreById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const store = await storeService.getStoreById(id, req.user?.id);
      res.status(200).json({
        success: true,
        data: store,
      });
    } catch (err) {
      next(err);
    }
  }

  async createStore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, address, ownerId } = req.body;
      const store = await storeService.createStore({
        name,
        email,
        address,
        ownerId,
      });

      res.status(201).json({
        success: true,
        message: 'Store created successfully',
        data: store,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const storeController = new StoreController();
