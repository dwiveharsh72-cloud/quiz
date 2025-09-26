import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { apiRoutes } from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDB();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api', limiter);

  // API routes
  app.use('/api', apiRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);


  const httpServer = createServer(app);

  return httpServer;
}
