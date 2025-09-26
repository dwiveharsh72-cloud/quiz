import { GoogleGenerativeAI } from '@google/generative-ai';
import { IFarmer } from '../models/Farmer';
import { IAnimalGroup } from '../models/AnimalGroup';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyB5D_VFMsgmnFToXCGGIgLkP0ygYrIzc0k');

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  category: string;
  animalType?: 'pig' | 'poultry' | 'cattle';
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateQuestions(
    farmer: IFarmer,
    animalGroups: IAnimalGroup[],
    numQuestions: number = 5,
    category?: string
  ): Promise<GeneratedQuestion[]> {
    try {
      const farmerContext = this.buildFarmerContext(farmer, animalGroups);
      const prompt = this.buildPrompt(farmerContext, numQuestions, category);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const questions = this.parseQuestionsFromResponse(text);
      return questions.slice(0, numQuestions);
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      throw new Error('Failed to generate questions');
    }
  }

  async generateDailyChallenge(
    farmer: IFarmer,
    animalGroups: IAnimalGroup[]
  ): Promise<GeneratedQuestion> {
    const questions = await this.generateQuestions(farmer, animalGroups, 1);
    return questions[0];
  }

  private buildFarmerContext(farmer: IFarmer, animalGroups: IAnimalGroup[]): string {
    const totalAnimals = animalGroups.reduce((sum, group) => sum + group.totalAnimals, 0);
    const animalTypes = [...new Set(animalGroups.map(group => group.animalType))];
    const allRisks = [...new Set(animalGroups.flatMap(group => group.risks))];

    return JSON.stringify({
      region: farmer.region,
      level: farmer.level,
      animalTypes,
      totalAnimals,
      risks: allRisks,
      groups: animalGroups.map(group => ({
        animalType: group.animalType,
        count: group.totalAnimals,
        vaccinationRate: group.totalAnimals > 0 ? (group.vaccinatedCount / group.totalAnimals * 100).toFixed(0) + '%' : '0%',
        risks: group.risks
      }))
    });
  }

  private buildPrompt(farmerContext: string, numQuestions: number, category?: string): string {
    const categoryFilter = category ? ` focusing on ${category}` : '';
    
    return `Generate ${numQuestions} multiple choice questions (MCQ) on biosecurity for a farmer with this profile: ${farmerContext}

Requirements:
- Topics: disease prevention, hygiene practices, vaccination protocols, compliance${categoryFilter}
- Each question must be practical and relevant to the farmer's specific situation
- Questions should be appropriate for their experience level
- Include region-specific considerations for ${JSON.parse(farmerContext).region}

Format each question as JSON:
{
  "question": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text (must match exactly one of the options)",
  "explanation": "Max 50 words: Why this is correct + practical tip personalized to this farm setup",
  "category": "Category name (e.g., ASF Prevention, Hygiene, Vaccination)",
  "animalType": "pig/poultry/cattle or null if general"
}

Return ONLY a JSON array of questions, no other text:`;
  }

  private parseQuestionsFromResponse(response: string): GeneratedQuestion[] {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const questions = JSON.parse(jsonMatch[0]);
      
      // Validate and transform questions
      return questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
        category: q.category,
        animalType: q.animalType || undefined
      }));
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Return fallback questions if parsing fails
      return this.getFallbackQuestions();
    }
  }

  private getFallbackQuestions(): GeneratedQuestion[] {
    return [
      {
        question: "What is the most important biosecurity measure for preventing disease outbreaks?",
        options: [
          "Regular cleaning and disinfection",
          "Feeding animals more",
          "Playing music for animals",
          "Painting the farm buildings"
        ],
        correct: "Regular cleaning and disinfection",
        explanation: "Regular cleaning and disinfection prevents disease-causing pathogens from spreading and is the foundation of good biosecurity.",
        category: "General Biosecurity"
      },
      {
        question: "How often should you clean animal housing areas?",
        options: [
          "Once a year",
          "Once a month",
          "Daily",
          "Only when animals are sick"
        ],
        correct: "Daily",
        explanation: "Daily cleaning prevents the buildup of pathogens and maintains a healthy environment for your animals.",
        category: "Hygiene"
      }
    ];
  }
}

export const geminiService = new GeminiService();