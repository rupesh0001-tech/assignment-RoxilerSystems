import express, { Express } from 'express';
import cors from 'cors';
import { ENV } from './configs/env';
import apiRouter from './routes';
import { errorHandler } from './middlewares/errorMiddleware';

const app: Express = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all local dev origins or configured origins
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RateHub API — Store Rating and Management Platform',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// API Routes
app.use('/api', apiRouter);

// Error Handling Middleware
app.use(errorHandler);

// Start server if not running under test
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`🚀 RateHub Backend running on http://localhost:${ENV.PORT}`);
    console.log(`📡 Environment: ${ENV.NODE_ENV}`);
  });
}

export default app;
