import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import authRoutes from './routes/auth.routes';
import onboardingRoutes from './routes/onboarding.routes';
import migrationRoutes from './routes/migration.routes';
import trackerRoutes from './routes/tracker.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Parsers
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan otentikasi. Silakan coba lagi beberapa saat lagi.'
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'doctor-tracker-backend',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/tracker', trackerRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(ENV.PORT, () => {
  console.log(`🩺 Doctor Tracker API running on http://localhost:${ENV.PORT}`);
  console.log(`✨ Environment: ${ENV.NODE_ENV}`);
});

export default app;

