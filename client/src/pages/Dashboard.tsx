import { useState } from "react";
import { useLocation } from "wouter";
import DailyChallenge from "@/components/DailyChallenge";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import StreakCounter from "@/components/StreakCounter";
import CoinDisplay from "@/components/CoinDisplay";
import LevelBadge from "@/components/LevelBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, TrendingUp } from "lucide-react";
import { useFarmerStats, useDailyChallenge, useSubmitQuiz } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - TODO: Replace with real data from API
const mockFarmerData = {
  totalCoins: 1250,
  currentStreak: 7,
  level: "specialist" as const,
  accuracy: 78,
  totalQuizzes: 45,
  correctAnswers: 35
};

const mockDailyQuestion = {
  id: 'daily-today',
  question: 'What is the recommended quarantine period for new cattle before introducing them to your herd?',
  options: [
    '1-2 days',
    '1 week', 
    '2-4 weeks',
    '2 months'
  ],
  correctAnswer: '2-4 weeks',
  explanation: 'For your cattle farm, quarantining new animals for 2-4 weeks helps identify any diseases before they can spread to your existing herd, protecting your investment and animal welfare.',
  category: 'Cattle Biosecurity',
  animalType: 'cattle' as const
};

const mockCalendarData = [
  // Generate last 30 days of mock data
  ...Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      completed: Math.random() > 0.3,
      streak: true
    };
  })
];

export default function Dashboard() {
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [, setLocation] = useLocation();
  
  // API hooks
  const { data: farmerStats, isLoading: statsLoading } = useFarmerStats();
  const { data: dailyChallenge, isLoading: challengeLoading } = useDailyChallenge();
  const submitQuizMutation = useSubmitQuiz();
  
  const handleDailyComplete = (coinsEarned: number) => {
    if (dailyChallenge) {
      submitQuizMutation.mutate({
        questionIds: [dailyChallenge.id],
        answers: { [dailyChallenge.id]: 'submitted' }, // This will be handled by the quiz component
        sessionType: 'daily'
      });
    }
  };
  
  const navigateToQuiz = () => {
    setLocation('/quiz');
  };
  
  const progressToNextLevel = () => {
    if (!farmerStats) return 0;
    const thresholds = { pupil: 500, specialist: 2000, master: Infinity };
    const currentThreshold = thresholds[farmerStats.level as keyof typeof thresholds];
    if (currentThreshold === Infinity) return 100;
    return Math.min((farmerStats.totalCoins / currentThreshold) * 100, 100);
  };

  if (statsLoading) {
    return (
      <div className="pb-20 min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-2 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-64 mb-4 bg-primary-foreground/20" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 bg-primary-foreground/20" />
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <Skeleton className="h-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-background" data-testid="dashboard">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="dashboard-title">FarmSecure</h1>
              <p className="text-primary-foreground/80">Your Biosecurity Learning Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <CoinDisplay coins={farmerStats?.totalCoins || 0} className="text-primary-foreground" />
              <LevelBadge level={(farmerStats?.level as any) || 'pupil'} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">Accuracy</span>
                </div>
                <div className="text-2xl font-bold">{farmerStats?.accuracy || 0}%</div>
                <p className="text-sm text-primary-foreground/70">{farmerStats?.correctAnswers || 0}/{farmerStats?.totalQuizzes || 0} correct</p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-4">
                <StreakCounter 
                  streak={farmerStats?.currentStreak || 0} 
                  className="text-primary-foreground" 
                />
              </CardContent>
            </Card>
            
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Level Progress</span>
                </div>
                <Progress value={progressToNextLevel()} className="mb-2" />
                <p className="text-sm text-primary-foreground/70">
                  {progressToNextLevel().toFixed(0)}% to next level
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Daily Challenge */}
        <section data-testid="daily-challenge-section">
          {challengeLoading ? (
            <Skeleton className="h-64" />
          ) : dailyChallenge ? (
            <DailyChallenge 
              question={dailyChallenge}
              isCompleted={dailyChallenge.isCompleted}
            onComplete={handleDailyComplete}
          />
          ) : null}
        </section>
        
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="quick-actions">
          <Card className="hover-elevate cursor-pointer" onClick={navigateToQuiz}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Take a Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Practice with 1-10 personalized questions on biosecurity topics
              </p>
              <Button className="w-full" data-testid="take-quiz-button">
                Start Quiz
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>This Week's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quizzes Completed</span>
                  <span className="font-semibold">5/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coins Earned</span>
                  <span className="font-semibold">+125</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-semibold">{farmerStats?.currentStreak || 0} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Calendar Heatmap */}
        <section data-testid="calendar-section">
          <CalendarHeatmap 
            data={mockCalendarData} 
            currentStreak={farmerStats?.currentStreak || 0} 
          />
        </section>
      </div>
    </div>
  );
}