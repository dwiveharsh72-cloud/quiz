import { Router } from 'express';
import { quizController } from '../controllers/quizController';

const router = Router();

// Quiz routes
router.post('/:farmerId/generate', quizController.generateQuiz);
router.post('/:farmerId/submit', quizController.submitQuiz);
router.get('/:farmerId/daily-challenge', quizController.getDailyChallenge);
router.get('/:farmerId/history', quizController.getQuizHistory);

export { router as quizRoutes };