import { Response, NextFunction } from 'express';
import { ratingService } from '../../services/rating/ratingService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class RatingController {
  async submitRating(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { storeId, rating, value } = req.body;
      const score = typeof value === 'number' ? value : rating;
      const result = await ratingService.submitRating(
        req.user!.id,
        storeId,
        score
      );

      res.status(200).json({
        success: true,
        message: 'Rating submitted successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyRatings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ratings = await ratingService.getMyRatings(req.user!.id);
      res.status(200).json({
        success: true,
        data: ratings,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStoreOwnerReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ratingService.getStoreOwnerReviews(req.user!.id);
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
