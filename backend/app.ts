import express, { Express } from 'express';
import cors from 'cors';
import { ENV } from './configs/env';
import apiRouter from './routes';
import { errorHandler } from './middlewares/errorMiddleware';

const app: Express = express();

const ALLOWED_ORIGINS = [
  'https://frontend-murex-two-44.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5001',
];

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Check if origin is explicitly allowed or matches a vercel app pattern
      if (
        ALLOWED_ORIGINS.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        (ENV.CORS_ORIGIN && (ENV.CORS_ORIGIN === '*' || ENV.CORS_ORIGIN.split(',').map(s => s.trim()).includes(origin)))
      ) {
        return callback(null, true);
      }

      // Allow in development or fallback
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RateHub API — Store Rating and Management Platform',
    version: '1.0.0',
    status: 'online',
    frontend: 'https://frontend-murex-two-44.vercel.app',
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
