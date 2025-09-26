import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CoinDisplay from "@/components/CoinDisplay";
import LevelBadge from "@/components/LevelBadge";
import FarmIcon from "@/components/FarmIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, MapPin, Phone, Award, Target, Flame } from "lucide-react";
import { useFarmerProfile, useFarmerStats } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

// Mock farmer profile data - TODO: Replace with real data
const mockProfile = {
  id: "farmer123",
  name: "Rajesh Kumar",
  phone: "+91-9876543210",
  region: "Karnataka",
  farmType: "pig" as const,
  totalAnimals: 150,
  totalCoins: 1250,
  level: "specialist" as "pupil" | "specialist" | "master",
  accuracy: 78,
  totalQuizzes: 45,
  correctAnswers: 35,
  currentStreak: 7,
  longestStreak: 15,
  nationalRank: 247,
  stateRank: 12,
  joinDate: "2024-08-15"
};

const achievements = [
  { title: "First Quiz Complete", icon: "🎯", earned: true },
  { title: "Week Warrior", icon: "🔥", earned: true, description: "7-day streak" },
  { title: "Quiz Master", icon: "🏆", earned: false, description: "Complete 100 quizzes" },
  { title: "Perfect Score", icon: "⭐", earned: true, description: "100% accuracy in a quiz" },
  { title: "Knowledge Seeker", icon: "📚", earned: false, description: "Complete 25 quizzes" },
  { title: "Biosecurity Expert", icon: "🛡️", earned: false, description: "Reach Master level" }
];

export default function Profile() {
  // API hooks
  const { data: farmerProfile, isLoading: profileLoading } = useFarmerProfile();
  const { data: farmerStats, isLoading: statsLoading } = useFarmerStats();
  
  const isLoading = profileLoading || statsLoading;
  
  const getProgressToNextLevel = () => {
    if (!farmerStats) return 0;
    const thresholds = { pupil: 500, specialist: 2000, master: Infinity };
    const currentThreshold = thresholds[farmerStats.level as keyof typeof thresholds];
    if (currentThreshold === Infinity) return 100;
    return Math.min((farmerStats.totalCoins / currentThreshold) * 100, 100);
  };

  const getNextLevelName = () => {
    if (!farmerStats) return "Specialist";
    return farmerStats.level === "pupil" ? "Specialist" : 
           farmerStats.level === "specialist" ? "Master" : "Max Level";
  };

  if (isLoading) {
    return (
      <div className="pb-20 min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-4 bg-primary-foreground/20" />
            <Skeleton className="h-32 bg-primary-foreground/20" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const farmer = farmerProfile?.farmer;
  const stats = farmerStats;

  return (
    <div className="pb-20 min-h-screen bg-background" data-testid="profile-page">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4" data-testid="profile-title">My Profile</h1>
          
          {/* Profile Card */}
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {farmer?.id?.slice(0, 2).toUpperCase() || 'FA'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold" data-testid="farmer-name">Farmer{farmer?.id?.slice(-3) || '123'}</h2>
                    <LevelBadge level={(stats?.level as any) || 'pupil'} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-primary-foreground/80 mb-3">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{farmer?.phone || '+91-XXXXXXXXXX'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{farmer?.region || 'Karnataka'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FarmIcon animalType="pig" className="h-4 w-4" />
                      <span>Mixed Farm</span>
                    </div>
                  </div>
                  
                  <CoinDisplay coins={stats?.totalCoins || 0} className="text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-overview">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats?.accuracy || 0}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats?.correctAnswers || 0}/{stats?.totalQuizzes || 0} correct
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-streak" />
              <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="text-xs text-muted-foreground mt-1">
                Best: {stats?.longestStreak || 0} days
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">#{stats?.nationalRank || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">National Rank</div>
              <div className="text-xs text-muted-foreground mt-1">
                #{stats?.stateRank || 'N/A'} in {farmer?.region || 'Karnataka'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats?.totalQuizzes || 0}</div>
              <div className="text-sm text-muted-foreground">Total Quizzes</div>
              <div className="text-xs text-muted-foreground mt-1">
                Since {farmer?.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : 'Recently'}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Level Progress */}
        <section data-testid="level-progress">
          <Card>
            <CardHeader>
              <CardTitle>Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Level</span>
                  <LevelBadge level={(stats?.level as any) || 'pupil'} />
                </div>
                
                {stats?.level !== "master" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progress to {getNextLevelName()}</span>
                      <span className="text-sm font-medium">{getProgressToNextLevel().toFixed(0)}%</span>
                    </div>
                    <Progress value={getProgressToNextLevel()} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {stats?.level === "pupil" 
                        ? `${500 - (stats?.totalCoins || 0)} more coins to reach Specialist`
                        : `${2000 - (stats?.totalCoins || 0)} more coins to reach Master`
                      }
                    </div>
                  </>
                )}
                
                {stats?.level === "master" && (
                  <div className="text-center py-4">
                    <div className="text-lg font-semibold text-primary mb-2">🏆 Master Level Achieved!</div>
                    <p className="text-sm text-muted-foreground">You've reached the highest level. Keep learning to maintain your expertise!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Achievements */}
        <section data-testid="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      achievement.earned 
                        ? 'bg-success/10 border-success/20' 
                        : 'bg-muted/50 border-border opacity-60'
                    }`}
                    data-testid={`achievement-${index}`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="font-medium text-sm">{achievement.title}</div>
                    {achievement.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </div>
                    )}
                    {achievement.earned && (
                      <Badge variant="secondary" className="mt-2 text-xs bg-success text-white">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}