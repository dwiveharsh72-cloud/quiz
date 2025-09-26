const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Farmer API methods
  async getFarmerProfile(farmerId: string) {
    return this.request(`/farmers/${farmerId}/profile`);
  }

  async updateFarmerProfile(farmerId: string, data: any) {
    return this.request(`/farmers/${farmerId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createFarmer(data: any) {
    return this.request('/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFarmerStats(farmerId: string) {
    return this.request(`/farmers/${farmerId}/stats`);
  }

  // Quiz API methods
  async generateQuiz(farmerId: string, options: { numQuestions?: number; category?: string } = {}) {
    return this.request(`/quiz/${farmerId}/generate`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async submitQuiz(farmerId: string, data: {
    questionIds: string[];
    answers: Record<string, string>;
    sessionType?: 'daily' | 'practice';
  }) {
    return this.request(`/quiz/${farmerId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDailyChallenge(farmerId: string) {
    return this.request(`/quiz/${farmerId}/daily-challenge`);
  }

  async getQuizHistory(farmerId: string, page = 1, limit = 10) {
    return this.request(`/quiz/${farmerId}/history?page=${page}&limit=${limit}`);
  }

  // Leaderboard API methods
  async getNationalLeaderboard(page = 1, limit = 100) {
    return this.request(`/leaderboard/national?page=${page}&limit=${limit}`);
  }

  async getStateLeaderboard(state: string, page = 1, limit = 100) {
    return this.request(`/leaderboard/state/${state}?page=${page}&limit=${limit}`);
  }

  async getFarmerRanking(farmerId: string) {
    return this.request(`/leaderboard/farmer/${farmerId}/ranking`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);