import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyChallenge extends Document {
  date: string; // YYYY-MM-DD
  questionId: string;
  createdAt: Date;
}

const dailyChallengeSchema = new Schema<IDailyChallenge>({
  date: { type: String, required: true, unique: true },
  questionId: { type: String, required: true, ref: 'QuizQuestion' }
}, {
  timestamps: true
});

export const DailyChallenge = mongoose.model<IDailyChallenge>('DailyChallenge', dailyChallengeSchema);