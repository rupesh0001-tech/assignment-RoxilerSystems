import { Router } from 'express';
import authRoutes from './auth/authRoutes';
import storeRoutes from './store/storeRoutes';
import ratingRoutes from './rating/ratingRoutes';
import adminRoutes from './admin/adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/admin', adminRoutes);

export default router;
