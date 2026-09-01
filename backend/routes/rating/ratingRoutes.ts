import { Router } from 'express';
import { ratingController } from '../../controllers/rating/ratingController';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validateMiddleware';
import { z } from 'zod';

const router = Router();

const submitRatingSchema = z.object({
  storeId: z.string().uuid('Invalid Store ID format'),
  value: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  comment: z
    .string()
    .max(500, 'Review comment must not exceed 500 characters')
    .optional(),
});

router.use(authenticate);

// Publicly logged-in review reading for any store
router.get('/store/:storeId', ratingController.getStoreReviews);

// Normal User rating submission
router.post(
  '/',
  authorize('NORMAL_USER', 'SYSTEM_ADMIN'),
  validate(submitRatingSchema),
  ratingController.submitRating
);

// Store Owner reviews retrieval
router.get(
  '/store-owner',
  authorize('STORE_OWNER', 'SYSTEM_ADMIN'),
  ratingController.getStoreOwnerReviews
);

export default router;
