import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import FarmIcon from "./FarmIcon";

interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    category: string;
    animalType?: "pig" | "poultry" | "cattle";
  };
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void;
  showResult?: boolean;
  selectedAnswer?: string;
}

export default function QuizQuestion({ 
  question, 
  onAnswer, 
  showResult = false, 
  selectedAnswer 
}: QuizQuestionProps) {
  const [answered, setAnswered] = useState(showResult);
  
  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    const isCorrect = answer === question.correctAnswer;
    setAnswered(true);
    onAnswer(answer, isCorrect);
  };

  const getOptionStyle = (option: string) => {
    if (!answered && !showResult) return "";
    
    if (option === question.correctAnswer) {
      return "border-success bg-success/10 text-success-dark";
    }
    
    if ((selectedAnswer || answered) && option === selectedAnswer && option !== question.correctAnswer) {
      return "border-destructive bg-destructive/10 text-destructive";
    }
    
    return "opacity-50";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="quiz-question">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          {question.animalType && <FarmIcon animalType={question.animalType} />}
          <span className="text-sm text-muted-foreground font-medium">{question.category}</span>
        </div>
        <CardTitle className="text-lg md:text-xl leading-relaxed" data-testid="question-text">
          {question.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            return (
              <Button
                key={option}
                variant="outline"
                className={`h-auto p-4 text-left justify-start hover-elevate active-elevate-2 ${getOptionStyle(option)}`}
                onClick={() => handleAnswer(option)}
                disabled={answered && !showResult}
                data-testid={`option-${letter.toLowerCase()}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">
                    {letter}
                  </div>
                  <span className="flex-1 text-base">{option}</span>
                  {answered && option === question.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  )}
                  {answered && selectedAnswer === option && option !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
        
        {(answered || showResult) && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg" data-testid="explanation">
            <h4 className="font-semibold mb-2 text-foreground">Explanation:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}