import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import QuizQuestion from "@/components/QuizQuestion";
import CoinDisplay from "@/components/CoinDisplay";
import { BookOpen, Play, RotateCcw, CheckCircle } from "lucide-react";

// Mock quiz questions - TODO: Replace with Gemini AI generated questions
const mockQuestions = [
  {
    id: '1',
    question: 'What is the most effective biosecurity measure to prevent African Swine Fever (ASF) in pig farms?',
    options: [
      'Regular vaccination programs',
      'Strict access control and disinfection protocols',
      'Feeding only imported feed',
      'Keeping pigs outdoors in open areas'
    ],
    correctAnswer: 'Strict access control and disinfection protocols',
    explanation: 'For your pig farm, implementing strict access control and disinfection protocols is crucial as ASF has no vaccine. Control who enters your farm, disinfect vehicles and equipment, and monitor feed sources.',
    category: 'ASF Prevention',
    animalType: 'pig' as const
  },
  {
    id: '2', 
    question: 'Which practice is essential when introducing new poultry to prevent disease outbreaks?',
    options: [
      'Immediate integration with existing flock',
      'Quarantine for 2-3 weeks before integration',
      'Feed them different food for first week',
      'Keep them in the coldest area of the farm'
    ],
    correctAnswer: 'Quarantine for 2-3 weeks before integration',
    explanation: 'For your poultry farm, quarantining new birds for 2-3 weeks allows monitoring for disease signs before they can affect your existing flock, protecting your investment.',
    category: 'Biosecurity',
    animalType: 'poultry' as const
  },
  {
    id: '3',
    question: 'What is the recommended frequency for cleaning and disinfecting cattle housing areas?',
    options: [
      'Once per month',
      'Only when animals get sick',
      'Daily cleaning with weekly disinfection',
      'Only during seasonal changes'
    ],
    correctAnswer: 'Daily cleaning with weekly disinfection',
    explanation: 'For your cattle farm, maintaining daily cleaning with weekly disinfection helps prevent disease buildup and maintains animal health, reducing veterinary costs.',
    category: 'Hygiene',
    animalType: 'cattle' as const
  }
];

type QuizState = 'setup' | 'active' | 'completed';

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [numQuestions, setNumQuestions] = useState([3]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  
  const startQuiz = () => {
    setQuizState('active');
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setCoinsEarned(0);
  };
  
  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    const questionId = mockQuestions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 10); // +10 coins per correct answer
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestion < numQuestions[0] - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setQuizState('completed');
      }
    }, 2000);
  };
  
  const resetQuiz = () => {
    setQuizState('setup');
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setCoinsEarned(0);
  };
  
  const accuracy = numQuestions[0] > 0 ? Math.round((score / numQuestions[0]) * 100) : 0;
  
  if (quizState === 'setup') {
    return (
      <div className="pb-20 min-h-screen bg-background" data-testid="quiz-setup">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2" data-testid="quiz-title">Take a Quiz</h1>
            <p className="text-primary-foreground/80">Test your biosecurity knowledge with personalized questions</p>
          </div>
        </div>
        
        {/* Setup Form */}
        <div className="max-w-2xl mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Quiz Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Number of Questions */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Number of Questions</label>
                <div className="space-y-3">
                  <Slider
                    value={numQuestions}
                    onValueChange={setNumQuestions}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                    data-testid="question-count-slider"
                  />
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {numQuestions[0]} Question{numQuestions[0] !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Quiz Categories */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Focus Area</label>
                <Select defaultValue="mixed">
                  <SelectTrigger data-testid="category-selector">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed Topics</SelectItem>
                    <SelectItem value="asf">African Swine Fever</SelectItem>
                    <SelectItem value="avian">Avian Flu Prevention</SelectItem>
                    <SelectItem value="hygiene">Farm Hygiene</SelectItem>
                    <SelectItem value="vaccination">Vaccination Protocols</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Potential Coins */}
              <div className="bg-coin/10 border border-coin/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Potential Reward</span>
                  <CoinDisplay coins={numQuestions[0] * 10} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Earn 10 coins for each correct answer
                </p>
              </div>
              
              {/* Start Button */}
              <Button 
                onClick={startQuiz} 
                className="w-full" 
                size="lg"
                data-testid="start-quiz-button"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (quizState === 'active') {
    return (
      <div className="pb-20 min-h-screen bg-background" data-testid="quiz-active">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold">Question {currentQuestion + 1} of {numQuestions[0]}</h1>
              <CoinDisplay 
                coins={coinsEarned} 
                className="text-primary-foreground" 
                size="sm" 
              />
            </div>
            <div className="w-full bg-primary-foreground/20 rounded-full h-2">
              <div 
                className="bg-primary-foreground h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / numQuestions[0]) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Question */}
        <div className="max-w-4xl mx-auto p-4">
          <QuizQuestion 
            question={mockQuestions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        </div>
      </div>
    );
  }
  
  // Completed state
  return (
    <div className="pb-20 min-h-screen bg-background" data-testid="quiz-completed">
      {/* Header */}
      <div className="bg-success text-white p-4">
        <div className="max-w-4xl mx-auto text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-white/80">Great job on completing the quiz</p>
        </div>
      </div>
      
      {/* Results */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Score Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <CoinDisplay coins={coinsEarned} size="lg" />
                <div className="text-sm text-muted-foreground mt-1">Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockQuestions.slice(0, numQuestions[0]).map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Badge 
                      variant={isCorrect ? "default" : "destructive"}
                      className={isCorrect ? "bg-success" : ""}
                    >
                      Q{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="text-sm space-y-1">
                        <div className={`${isCorrect ? 'text-success' : 'text-destructive'}`}>
                          Your answer: {userAnswer}
                        </div>
                        {!isCorrect && (
                          <div className="text-success">
                            Correct answer: {question.correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={resetQuiz} data-testid="retake-quiz-button">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Another Quiz
          </Button>
          <Button onClick={() => console.log('Navigate to dashboard')} data-testid="back-dashboard-button">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}