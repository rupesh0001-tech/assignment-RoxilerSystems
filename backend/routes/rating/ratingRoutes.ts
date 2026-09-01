import { Router } from 'express';
import { ratingController } from '../../controllers/rating/ratingController';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validateMiddleware';
import { z } from 'zod';

const router = Router();

const submitRatingSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  value: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
}).refine((data) => data.value !== undefined || data.rating !== undefined, {
  message: 'Rating value (1-5) is required',
});

router.post(
  '/',
  authenticate,
  authorize('NORMAL_USER'),
  validate(submitRatingSchema),
  ratingController.submitRating
);

router.get(
  '/my',
  authenticate,
  authorize('NORMAL_USER'),
  ratingController.getMyRatings
);

router.get(
  '/store-owner',
  authenticate,
  authorize('STORE_OWNER'),
  ratingController.getStoreOwnerReviews
);

export default router;
