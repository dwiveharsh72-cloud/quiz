import { Router } from 'express';
import { farmerRoutes } from './farmerRoutes';
import { quizRoutes } from './quizRoutes';
import { leaderboardRoutes } from './leaderboardRoutes';

const router = Router();

// API routes
router.use('/farmers', farmerRoutes);
router.use('/quiz', quizRoutes);
router.use('/leaderboard', leaderboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export { router as apiRoutes };