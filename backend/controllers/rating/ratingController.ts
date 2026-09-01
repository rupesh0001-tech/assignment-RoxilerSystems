import { Response, NextFunction } from 'express';
import { ratingService } from '../../services/rating/ratingService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class RatingController {
  async submitRating(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { storeId, value, comment } = req.body;
      const userId = req.user!.id;

      const rating = await ratingService.submitRating(
        userId,
        storeId,
        Number(value),
        comment
      );

      res.status(200).json({
        success: true,
        message: 'Rating and review submitted successfully',
        data: rating,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStoreReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const reviewsData = await ratingService.getStoreReviews(storeId);

      res.status(200).json({
        success: true,
        data: reviewsData,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStoreOwnerReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.id;
      const data = await ratingService.getStoreOwnerReviews(ownerId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const ratingController = new RatingController();
