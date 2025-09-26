import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboardController';

const router = Router();

// Leaderboard routes
router.get('/national', leaderboardController.getNationalLeaderboard);
router.get('/state/:state', leaderboardController.getStateLeaderboard);
router.get('/farmer/:farmerId/ranking', leaderboardController.getFarmerRanking);

export { router as leaderboardRoutes };