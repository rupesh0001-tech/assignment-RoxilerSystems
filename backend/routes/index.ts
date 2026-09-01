import { Router } from 'express';
import authRoutes from './auth/authRoutes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'RateHub Store Rating API',
  });
});

export default apiRouter;
