import { Request, Response } from 'express';
import { Farmer } from '../models/Farmer';
import { AnimalGroup } from '../models/AnimalGroup';

export class FarmerController {
  async getFarmerProfile(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      
      const farmer = await Farmer.findOne({ id: farmerId });
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      const animalGroups = await AnimalGroup.find({ farmerId });
      
      res.json({
        farmer: {
          ...farmer.toJSON(),
          accuracy: farmer.accuracy
        },
        animalGroups
      });
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateFarmerProfile(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const updates = req.body;

      const farmer = await Farmer.findOneAndUpdate(
        { id: farmerId },
        updates,
        { new: true, runValidators: true }
      );

      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      res.json({ farmer });
    } catch (error) {
      console.error('Error updating farmer profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createFarmer(req: Request, res: Response) {
    try {
      const farmerData = req.body;
      
      const farmer = new Farmer(farmerData);
      await farmer.save();

      res.status(201).json({ farmer });
    } catch (error) {
      console.error('Error creating farmer:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Farmer with this phone number already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getFarmerStats(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      
      const farmer = await Farmer.findOne({ id: farmerId });
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      // Calculate national and state rankings
      const nationalRank = await Farmer.countDocuments({
        totalCoins: { $gt: farmer.totalCoins }
      }) + 1;

      const stateRank = await Farmer.countDocuments({
        region: farmer.region,
        totalCoins: { $gt: farmer.totalCoins }
      }) + 1;

      res.json({
        totalCoins: farmer.totalCoins,
        currentStreak: farmer.currentStreak,
        longestStreak: farmer.longestStreak,
        level: farmer.level,
        accuracy: farmer.accuracy,
        totalQuizzes: farmer.totalQuizzes,
        correctAnswers: farmer.correctAnswers,
        nationalRank,
        stateRank
      });
    } catch (error) {
      console.error('Error fetching farmer stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const farmerController = new FarmerController();