import { Request, Response } from 'express';
import { QuizQuestion } from '../models/QuizQuestion';
import { QuizSession } from '../models/QuizSession';
import { Farmer } from '../models/Farmer';
import { AnimalGroup } from '../models/AnimalGroup';
import { DailyChallenge } from '../models/DailyChallenge';
import { geminiService } from '../services/geminiService';

export class QuizController {
  async generateQuiz(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const { numQuestions = 5, category } = req.body;

      const farmer = await Farmer.findOne({ id: farmerId });
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      const animalGroups = await AnimalGroup.find({ farmerId });
      
      // Generate questions using Gemini AI
      const generatedQuestions = await geminiService.generateQuestions(
        farmer,
        animalGroups,
        numQuestions,
        category
      );

      // Store questions in database for future reference
      const savedQuestions = await Promise.all(
        generatedQuestions.map(async (q) => {
          const question = new QuizQuestion({
            question: q.question,
            options: q.options,
            correctAnswer: q.correct,
            explanation: q.explanation,
            category: q.category,
            animalType: q.animalType
          });
          return await question.save();
        })
      );

      res.json({
        questions: savedQuestions.map(q => ({
          id: q._id,
          question: q.question,
          options: q.options,
          category: q.category,
          animalType: q.animalType
        }))
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  }

  async submitQuiz(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const { questionIds, answers, sessionType = 'practice' } = req.body;

      const farmer = await Farmer.findOne({ id: farmerId });
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      // Get questions to calculate score
      const questions = await QuizQuestion.find({
        _id: { $in: questionIds }
      });

      let score = 0;
      const results = questions.map(question => {
        const userAnswer = answers[question._id.toString()];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) score++;

        return {
          questionId: question._id,
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation
        };
      });

      const accuracy = Math.round((score / questions.length) * 100);
      const coinsEarned = score * (sessionType === 'daily' ? 15 : 10);

      // Save quiz session
      const session = new QuizSession({
        farmerId,
        questions: questionIds,
        answers,
        score,
        coinsEarned,
        accuracy,
        sessionType
      });
      await session.save();

      // Update farmer stats
      farmer.totalQuizzes += 1;
      farmer.correctAnswers += score;
      farmer.totalCoins += coinsEarned;
      farmer.lastQuizDate = new Date();

      // Update streak for daily challenges
      if (sessionType === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        if (farmer.lastDailyChallengeDate === yesterday) {
          farmer.currentStreak += 1;
        } else if (farmer.lastDailyChallengeDate !== today) {
          farmer.currentStreak = 1;
        }
        
        if (farmer.currentStreak > farmer.longestStreak) {
          farmer.longestStreak = farmer.currentStreak;
        }
        
        farmer.lastDailyChallengeDate = today;
      }

      // Update level
      farmer.updateLevel();
      await farmer.save();

      res.json({
        score,
        accuracy,
        coinsEarned,
        totalCoins: farmer.totalCoins,
        currentStreak: farmer.currentStreak,
        level: farmer.level,
        results
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Failed to submit quiz' });
    }
  }

  async getDailyChallenge(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const today = new Date().toISOString().split('T')[0];

      const farmer = await Farmer.findOne({ id: farmerId });
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      // Check if already completed today
      const isCompleted = farmer.lastDailyChallengeDate === today;

      let dailyChallenge = await DailyChallenge.findOne({ date: today })
        .populate('questionId');

      if (!dailyChallenge) {
        // Generate new daily challenge
        const animalGroups = await AnimalGroup.find({ farmerId });
        const generatedQuestion = await geminiService.generateDailyChallenge(farmer, animalGroups);

        const question = new QuizQuestion({
          question: generatedQuestion.question,
          options: generatedQuestion.options,
          correctAnswer: generatedQuestion.correct,
          explanation: generatedQuestion.explanation,
          category: generatedQuestion.category,
          animalType: generatedQuestion.animalType
        });
        await question.save();

        dailyChallenge = new DailyChallenge({
          date: today,
          questionId: question._id
        });
        await dailyChallenge.save();
        await dailyChallenge.populate('questionId');
      }

      const question = dailyChallenge.questionId as any;

      res.json({
        id: question._id,
        question: question.question,
        options: question.options,
        category: question.category,
        animalType: question.animalType,
        isCompleted,
        date: today
      });
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      res.status(500).json({ error: 'Failed to fetch daily challenge' });
    }
  }

  async getQuizHistory(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const sessions = await QuizSession.find({ farmerId })
        .sort({ completedAt: -1 })
        .limit(Number(limit) * Number(page))
        .skip((Number(page) - 1) * Number(limit));

      const total = await QuizSession.countDocuments({ farmerId });

      res.json({
        sessions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      res.status(500).json({ error: 'Failed to fetch quiz history' });
    }
  }
}

export const quizController = new QuizController();