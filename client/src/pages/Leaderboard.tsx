import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CoinDisplay from "@/components/CoinDisplay";
import LevelBadge from "@/components/LevelBadge";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { useNationalLeaderboard, useStateLeaderboard, useFarmerRanking } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

// Mock leaderboard data - TODO: Replace with real API data
const mockNationalData = [
  { id: "1", name: "FarmMaster23", region: "Punjab", coins: 3250, accuracy: 94, level: "master" },
  { id: "2", name: "AgriExpert", region: "Maharashtra", coins: 3100, accuracy: 91, level: "master" },
  { id: "3", name: "CropGuardian", region: "Tamil Nadu", coins: 2950, accuracy: 89, level: "master" },
  { id: "4", name: "BioSecurePro", region: "Karnataka", coins: 2800, accuracy: 87, level: "specialist" },
  { id: "5", name: "FarmDefender", region: "Andhra Pradesh", coins: 2650, accuracy: 85, level: "specialist" },
  { id: "6", name: "LivestockLord", region: "Rajasthan", coins: 2500, accuracy: 83, level: "specialist" },
  { id: "7", name: "QuizChampion", region: "Gujarat", coins: 2350, accuracy: 81, level: "specialist" },
  { id: "8", name: "SanitationStar", region: "Haryana", coins: 2200, accuracy: 79, level: "specialist" },
  { id: "9", name: "HealthHero", region: "Uttar Pradesh", coins: 2050, accuracy: 77, level: "specialist" },
  { id: "10", name: "SafetyScout", region: "West Bengal", coins: 1900, accuracy: 75, level: "pupil" },
];

const mockStateData = {
  Karnataka: [
    { id: "4", name: "BioSecurePro", region: "Karnataka", coins: 2800, accuracy: 87, level: "specialist" },
    { id: "11", name: "KarnatakaBest", region: "Karnataka", coins: 1250, accuracy: 78, level: "specialist" }, // Current user
    { id: "12", name: "BangaloreFarmer", region: "Karnataka", coins: 1100, accuracy: 72, level: "pupil" },
    { id: "13", name: "MysoreChamp", region: "Karnataka", coins: 950, accuracy: 68, level: "pupil" },
    { id: "14", name: "HubliHero", region: "Karnataka", coins: 800, accuracy: 65, level: "pupil" },
  ],
  Punjab: [
    { id: "1", name: "FarmMaster23", region: "Punjab", coins: 3250, accuracy: 94, level: "master" },
    { id: "15", name: "PunjabPride", region: "Punjab", coins: 2100, accuracy: 81, level: "specialist" },
    { id: "16", name: "WheatWarrior", region: "Punjab", coins: 1800, accuracy: 76, level: "pupil" },
  ],
  Maharashtra: [
    { id: "2", name: "AgriExpert", region: "Maharashtra", coins: 3100, accuracy: 91, level: "master" },
    { id: "17", name: "MumbaiMaster", region: "Maharashtra", coins: 2000, accuracy: 79, level: "specialist" },
    { id: "18", name: "PuneProud", region: "Maharashtra", coins: 1700, accuracy: 74, level: "pupil" },
  ]
};

const states = ["Karnataka", "Punjab", "Maharashtra", "Tamil Nadu", "Gujarat"];
const currentUserId = "11"; // Mock current user

export default function Leaderboard() {
  const [selectedState, setSelectedState] = useState("Karnataka");
  
  // API hooks
  const { data: nationalData, isLoading: nationalLoading } = useNationalLeaderboard();
  const { data: stateData, isLoading: stateLoading } = useStateLeaderboard(selectedState);
  const { data: farmerRanking, isLoading: rankingLoading } = useFarmerRanking();
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-4 w-4 text-muted-foreground" />;
  };
  
  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-muted text-muted-foreground";
  };
  
  const isCurrentUser = (userId: string) => userId === 'farmer123'; // Mock current user
  
  const renderLeaderboardItem = (user: any, rank: number, showState = false) => (
    <div
      key={user.id}
      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover-elevate ${
        isCurrentUser(user.id) 
          ? 'bg-primary/5 border-primary/20' 
          : 'bg-card hover:bg-muted/50'
      }`}
      data-testid={`leaderboard-item-${rank}`}
    >
      <div className="flex items-center gap-3">
        <Badge className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadgeStyle(rank)}`}>
          {rank <= 3 ? getRankIcon(rank) : rank}
        </Badge>
        
        <Avatar className="h-10 w-10">
          <AvatarFallback className={isCurrentUser(user.id) ? "bg-primary text-primary-foreground" : ""}>
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-semibold ${isCurrentUser(user.id) ? 'text-primary' : ''}`}>
            {user.name}
            {isCurrentUser(user.id) && " (You)"}
          </span>
          <LevelBadge level={user.level as "pupil" | "specialist" | "master"} />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {showState && <span>{user.region}</span>}
          <span>{user.accuracy}% accuracy</span>
        </div>
      </div>
      
      <CoinDisplay coins={user.coins} size="sm" />
    </div>
  );

  if (nationalLoading && stateLoading && rankingLoading) {
    return (
      <div className="pb-20 min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-2 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-64 bg-primary-foreground/20" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-background" data-testid="leaderboard-page">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2" data-testid="leaderboard-title">Leaderboard</h1>
          <p className="text-primary-foreground/80">See how you rank among farmers across India</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="national" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6" data-testid="leaderboard-tabs">
            <TabsTrigger value="national" data-testid="tab-national">National Top 100</TabsTrigger>
            <TabsTrigger value="state" data-testid="tab-state">State Rankings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="national" className="space-y-4" data-testid="national-leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  India Top 10
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {nationalLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))
                  ) : (
                    nationalData?.leaderboard?.map((user: any, index: number) => 
                    renderLeaderboardItem(user, index + 1, true)
                    ) || []
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="state" className="space-y-4" data-testid="state-leaderboard">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-primary" />
                    State Rankings
                  </CardTitle>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-40" data-testid="state-selector">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {stateLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))
                  ) : (
                    stateData?.leaderboard?.map((user: any, index: number) => 
                    renderLeaderboardItem(user, index + 1, false)
                    ) || []
                  ) || (
                    <div className="text-center py-8 text-muted-foreground">
                      No data available for {selectedState}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Your Current Ranking */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rankingLoading ? (
                <>
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </>
              ) : (
                <>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">#{farmerRanking?.nationalRank || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">National Rank</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">#{farmerRanking?.stateRank || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">{selectedState} Rank</div>
              </div>
                </>
              )}
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                💡 <strong>Tip:</strong> Complete daily challenges and maintain your streak to climb higher!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}