import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Mock farmer ID - replace with actual authentication
const MOCK_FARMER_ID = 'farmer123';

export function useFarmerProfile(farmerId: string = MOCK_FARMER_ID) {
  return useQuery({
    queryKey: ['farmer', farmerId, 'profile'],
    queryFn: () => apiClient.getFarmerProfile(farmerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFarmerStats(farmerId: string = MOCK_FARMER_ID) {
  return useQuery({
    queryKey: ['farmer', farmerId, 'stats'],
    queryFn: () => apiClient.getFarmerStats(farmerId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useGenerateQuiz(farmerId: string = MOCK_FARMER_ID) {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (options: { numQuestions?: number; category?: string }) =>
      apiClient.generateQuiz(farmerId, options),
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to generate quiz. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useSubmitQuiz(farmerId: string = MOCK_FARMER_ID) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: {
      questionIds: string[];
      answers: Record<string, string>;
      sessionType?: 'daily' | 'practice';
    }) => apiClient.submitQuiz(farmerId, data),
    onSuccess: (data) => {
      // Invalidate and refetch farmer stats
      queryClient.invalidateQueries({ queryKey: ['farmer', farmerId] });
      
      toast({
        title: 'Quiz Completed!',
        description: `You earned ${data.coinsEarned} coins with ${data.accuracy}% accuracy.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useDailyChallenge(farmerId: string = MOCK_FARMER_ID) {
  return useQuery({
    queryKey: ['farmer', farmerId, 'daily-challenge'],
    queryFn: () => apiClient.getDailyChallenge(farmerId),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useQuizHistory(farmerId: string = MOCK_FARMER_ID, page = 1) {
  return useQuery({
    queryKey: ['farmer', farmerId, 'quiz-history', page],
    queryFn: () => apiClient.getQuizHistory(farmerId, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useNationalLeaderboard(page = 1) {
  return useQuery({
    queryKey: ['leaderboard', 'national', page],
    queryFn: () => apiClient.getNationalLeaderboard(page),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStateLeaderboard(state: string, page = 1) {
  return useQuery({
    queryKey: ['leaderboard', 'state', state, page],
    queryFn: () => apiClient.getStateLeaderboard(state, page),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!state,
  });
}

export function useFarmerRanking(farmerId: string = MOCK_FARMER_ID) {
  return useQuery({
    queryKey: ['farmer', farmerId, 'ranking'],
    queryFn: () => apiClient.getFarmerRanking(farmerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}