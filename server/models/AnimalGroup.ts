import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimalGroup extends Document {
  id: string;
  farmerId: string;
  groupName: string;
  animalType: 'pig' | 'poultry' | 'cattle';
  breedType: string;
  totalAnimals: number;
  vaccinatedCount: number;
  ageRange: {
    min: number;
    max: number;
  };
  risks: string[];
  createdAt: Date;
}

const animalGroupSchema = new Schema<IAnimalGroup>({
  id: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true, ref: 'Farmer' },
  groupName: { type: String, required: true },
  animalType: { 
    type: String, 
    required: true, 
    enum: ['pig', 'poultry', 'cattle'] 
  },
  breedType: { type: String, required: true },
  totalAnimals: { type: Number, default: 0 },
  vaccinatedCount: { type: Number, default: 0 },
  ageRange: {
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 0 }
  },
  risks: [{ type: String }]
}, {
  timestamps: true
});

export const AnimalGroup = mongoose.model<IAnimalGroup>('AnimalGroup', animalGroupSchema);