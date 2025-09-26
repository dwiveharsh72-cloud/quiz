import { Request, Response } from 'express';
import { Farmer } from '../models/Farmer';

export class LeaderboardController {
  async getNationalLeaderboard(req: Request, res: Response) {
    try {
      const { page = 1, limit = 100 } = req.query;

      const leaderboard = await Farmer.find({ isVerified: true })
        .select('id phone region totalCoins level')
        .sort({ totalCoins: -1, correctAnswers: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const leaderboardWithRanks = leaderboard.map((farmer, index) => ({
        rank: (Number(page) - 1) * Number(limit) + index + 1,
        id: farmer.id,
        name: `Farmer${farmer.id.slice(-3)}`, // Anonymous name
        region: farmer.region,
        coins: farmer.totalCoins,
        level: farmer.level,
        accuracy: farmer.accuracy
      }));

      res.json({ leaderboard: leaderboardWithRanks });
    } catch (error) {
      console.error('Error fetching national leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  async getStateLeaderboard(req: Request, res: Response) {
    try {
      const { state } = req.params;
      const { page = 1, limit = 100 } = req.query;

      const leaderboard = await Farmer.find({ 
        region: state, 
        isVerified: true 
      })
        .select('id phone region totalCoins level')
        .sort({ totalCoins: -1, correctAnswers: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const leaderboardWithRanks = leaderboard.map((farmer, index) => ({
        rank: (Number(page) - 1) * Number(limit) + index + 1,
        id: farmer.id,
        name: `Farmer${farmer.id.slice(-3)}`,
        region: farmer.region,
        coins: farmer.totalCoins,
        level: farmer.level,
        accuracy: farmer.accuracy
      }));

      res.json({ leaderboard: leaderboardWithRanks });
    } catch (error) {
      console.error('Error fetching state leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch state leaderboard' });
    }
  }

  async getFarmerRanking(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;

      const farmer = await Farmer.findOne({ id: farmerId });
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      // Calculate national rank
      const nationalRank = await Farmer.countDocuments({
        totalCoins: { $gt: farmer.totalCoins },
        isVerified: true
      }) + 1;

      // Calculate state rank
      const stateRank = await Farmer.countDocuments({
        region: farmer.region,
        totalCoins: { $gt: farmer.totalCoins },
        isVerified: true
      }) + 1;

      // Get total farmers for percentile calculation
      const totalNationalFarmers = await Farmer.countDocuments({ isVerified: true });
      const totalStateFarmers = await Farmer.countDocuments({ 
        region: farmer.region, 
        isVerified: true 
      });

      res.json({
        nationalRank,
        stateRank,
        nationalPercentile: Math.round((1 - (nationalRank - 1) / totalNationalFarmers) * 100),
        statePercentile: Math.round((1 - (stateRank - 1) / totalStateFarmers) * 100),
        totalCoins: farmer.totalCoins,
        level: farmer.level,
        accuracy: farmer.accuracy
      });
    } catch (error) {
      console.error('Error fetching farmer ranking:', error);
      res.status(500).json({ error: 'Failed to fetch ranking' });
    }
  }
}

export const leaderboardController = new LeaderboardController();