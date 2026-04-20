import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { auditMiddleware } from './middleware/audit.middleware';
import { env } from './config/env';
import { Database } from './config/db';
import { AppLogger } from './config/logger';

export const createApp = (): Application => {
  const app = express();

  // 1. Permissive CORS (Must be first)
  app.use(cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }));

  // 2. Debug Logging
  app.use((req, _res, next) => {
    AppLogger.info(`>>> ${req.method} ${req.url}`);
    next();
  });

  // 3. Security & Parsing
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('combined', { stream: { write: (msg: string) => AppLogger.info(msg.trim()) } }));

  // Audit middleware (captures request metadata)
  app.use(auditMiddleware);

  // API routes
  app.use('/api/v1', routes);

  // Global error handler
  app.use(errorMiddleware);

  return app;
};

// Initialize DB connection
Database.connect()
  .catch((err: Error) => AppLogger.error('MongoDB initialization failed', err));
