import { Router } from 'express';
import { farmerController } from '../controllers/farmerController';

const router = Router();

// Farmer profile routes
router.get('/:farmerId/profile', farmerController.getFarmerProfile);
router.put('/:farmerId/profile', farmerController.updateFarmerProfile);
router.post('/', farmerController.createFarmer);
router.get('/:farmerId/stats', farmerController.getFarmerStats);

export { router as farmerRoutes };