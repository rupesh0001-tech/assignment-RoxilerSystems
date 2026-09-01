import { Router } from 'express';
import { storeController } from '../../controllers/store/storeController';
import { authenticate, optionalAuth, authorize } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validateMiddleware';
import { z } from 'zod';

const router = Router();

const createStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required').max(400),
  ownerId: z.string().uuid().optional(),
});

router.get('/', optionalAuth, storeController.getAllStores);
router.get('/:id', optionalAuth, storeController.getStoreById);
router.post(
  '/',
  authenticate,
  authorize('SYSTEM_ADMIN'),
  validate(createStoreSchema),
  storeController.createStore
);

export default router;
