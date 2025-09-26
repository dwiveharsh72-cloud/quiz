import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmer extends Document {
  id: string;
  phone: string;
  region: string;
  isVerified: boolean;
  latitude?: number;
  longitude?: number;
  totalCoins: number;
  currentStreak: number;
  longestStreak: number;
  level: 'pupil' | 'specialist' | 'master';
  totalQuizzes: number;
  correctAnswers: number;
  lastQuizDate?: Date;
  lastDailyChallengeDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const farmerSchema = new Schema<IFarmer>({
  id: { type: String, required: true, unique: true },
  phone: { type: String, required: true, trim: true, unique: true },
  region: { type: String, required: true, trim: true },
  isVerified: { type: Boolean, default: true },
  latitude: { type: Number },
  longitude: { type: Number },
  totalCoins: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  level: { 
    type: String, 
    enum: ['pupil', 'specialist', 'master'], 
    default: 'pupil' 
  },
  totalQuizzes: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  lastDailyChallengeDate: { type: String }, // YYYY-MM-DD format
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for accuracy percentage
farmerSchema.virtual('accuracy').get(function() {
  return this.totalQuizzes > 0 ? Math.round((this.correctAnswers / this.totalQuizzes) * 100) : 0;
});

// Method to update level based on coins
farmerSchema.methods.updateLevel = function() {
  if (this.totalCoins >= 2001) {
    this.level = 'master';
  } else if (this.totalCoins >= 501) {
    this.level = 'specialist';
  } else {
    this.level = 'pupil';
  }
};

export const Farmer = mongoose.model<IFarmer>('Farmer', farmerSchema);