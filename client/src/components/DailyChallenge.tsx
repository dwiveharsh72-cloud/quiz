import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";
import QuizQuestion from "./QuizQuestion";
import CoinDisplay from "./CoinDisplay";

interface DailyChallengeProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    category: string;
    animalType?: "pig" | "poultry" | "cattle";
  };
  isCompleted?: boolean;
  onComplete: (coinsEarned: number) => void;
}

export default function DailyChallenge({ question, isCompleted = false, onComplete }: DailyChallengeProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [coinsEarned, setCoinsEarned] = useState(0);
  
  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    const coins = isCorrect ? 15 : 5; // Bonus coins for daily challenge
    setCoinsEarned(coins);
    setCompleted(true);
    onComplete(coins);
  };

  if (completed) {
    return (
      <Card className="w-full border-success/50 bg-success/5" data-testid="daily-challenge-completed">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <CardTitle className="text-lg">Daily Challenge Complete!</CardTitle>
            </div>
            <CoinDisplay coins={coinsEarned} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-success font-medium mb-4">Great job! Come back tomorrow for a new challenge.</p>
          <QuizQuestion 
            question={question} 
            onAnswer={() => {}} 
            showResult={true}
            selectedAnswer={question.correctAnswer}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-primary/50 bg-primary/5" data-testid="daily-challenge">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Today's Biosecurity Challenge</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-coin text-white font-semibold">
            +15 Coins
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Complete today's challenge to maintain your streak!</p>
      </CardHeader>
      
      <CardContent>
        <QuizQuestion question={question} onAnswer={handleAnswer} />
      </CardContent>
    </Card>
  );
}