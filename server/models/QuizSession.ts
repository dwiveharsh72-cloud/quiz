import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizSession extends Document {
  farmerId: string;
  questions: string[]; // Question IDs
  answers: Record<string, string>; // questionId -> selectedAnswer
  score: number;
  coinsEarned: number;
  accuracy: number;
  sessionType: 'daily' | 'practice';
  completedAt: Date;
}

const quizSessionSchema = new Schema<IQuizSession>({
  farmerId: { type: String, required: true, ref: 'Farmer' },
  questions: [{ type: String, required: true }],
  answers: { type: Map, of: String, required: true },
  score: { type: Number, default: 0 },
  coinsEarned: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  sessionType: { 
    type: String, 
    enum: ['daily', 'practice'], 
    default: 'practice' 
  }
}, {
  timestamps: { createdAt: 'completedAt', updatedAt: false }
});

export const QuizSession = mongoose.model<IQuizSession>('QuizSession', quizSessionSchema);