import { Router } from 'express';
import { adminController } from '../../controllers/admin/adminController';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validateMiddleware';
import { z } from 'zod';

const router = Router();

const createUserSchema = z.object({
  name: z
    .string()
    .min(6, 'Name must be at least 6 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(400, 'Address must not exceed 400 characters'),
  role: z.enum(['SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER']),
});

router.use(authenticate, authorize('SYSTEM_ADMIN'));

router.get('/metrics', adminController.getMetrics);
router.get('/users', adminController.getAllUsers);
router.post('/users', validate(createUserSchema), adminController.createUser);

export default router;
