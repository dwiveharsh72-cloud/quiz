import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  animalType?: 'pig' | 'poultry' | 'cattle';
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

const quizQuestionSchema = new Schema<IQuizQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  category: { type: String, required: true },
  animalType: { 
    type: String, 
    enum: ['pig', 'poultry', 'cattle'] 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  }
}, {
  timestamps: true
});

export const QuizQuestion = mongoose.model<IQuizQuestion>('QuizQuestion', quizQuestionSchema);