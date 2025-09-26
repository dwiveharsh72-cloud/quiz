# FarmSecure - Gamified Biosecurity Quiz Platform

A LeetCode-inspired gamified learning platform for farmers to improve their biosecurity knowledge through interactive quizzes and daily challenges.

## 🚀 Features

### Core Features
- **Daily Challenges**: LeetCode-style daily biosecurity questions
- **Personalized Quizzes**: AI-generated questions based on farmer profile
- **Gamification**: Coins, levels (Pupil → Specialist → Master), streaks
- **Leaderboards**: National and state-wise rankings
- **Progress Tracking**: Calendar heatmap, accuracy metrics, achievements

### AI Integration
- **Gemini AI**: Generates personalized questions based on:
  - Farmer's region and animal types
  - Farm size and vaccination status
  - Risk factors and experience level
  - Previous quiz performance

### Backend Features
- **MongoDB**: Complete data persistence
- **RESTful API**: Clean, documented endpoints
- **Error Handling**: Comprehensive error management
- **Validation**: Request validation with Zod
- **Rate Limiting**: API protection
- **CORS**: Secure cross-origin requests

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Radix UI** components
- **Lucide React** icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Gemini AI** for question generation
- **Zod** for validation
- **TypeScript** throughout

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd farmsecure
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/farmsecure
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 🔧 API Endpoints

### Farmer Management
- `GET /api/farmers/:farmerId/profile` - Get farmer profile
- `PUT /api/farmers/:farmerId/profile` - Update farmer profile
- `POST /api/farmers` - Create new farmer
- `GET /api/farmers/:farmerId/stats` - Get farmer statistics

### Quiz System
- `POST /api/quiz/:farmerId/generate` - Generate personalized quiz
- `POST /api/quiz/:farmerId/submit` - Submit quiz answers
- `GET /api/quiz/:farmerId/daily-challenge` - Get daily challenge
- `GET /api/quiz/:farmerId/history` - Get quiz history

### Leaderboards
- `GET /api/leaderboard/national` - National leaderboard
- `GET /api/leaderboard/state/:state` - State leaderboard
- `GET /api/leaderboard/farmer/:farmerId/ranking` - Farmer ranking

## 🎯 Usage Examples

### Creating a Farmer
```javascript
const farmer = await apiClient.createFarmer({
  id: 'farmer123',
  phone: '+91-9876543210',
  region: 'Karnataka',
  isVerified: true
});
```

### Generating a Quiz
```javascript
const quiz = await apiClient.generateQuiz('farmer123', {
  numQuestions: 5,
  category: 'ASF Prevention'
});
```

### Submitting Quiz Results
```javascript
const result = await apiClient.submitQuiz('farmer123', {
  questionIds: ['q1', 'q2', 'q3'],
  answers: { 'q1': 'Option A', 'q2': 'Option B', 'q3': 'Option C' },
  sessionType: 'practice'
});
```

## 🎨 UI/UX Features

### LeetCode-Inspired Design
- Clean, minimal interface
- Consistent color scheme
- Smooth animations and transitions
- Mobile-first responsive design
- High contrast for accessibility

### Gamification Elements
- **Coins**: Earned for correct answers (10 for practice, 15 for daily)
- **Levels**: Pupil (0-500), Specialist (501-2000), Master (2001+)
- **Streaks**: Daily challenge completion tracking
- **Achievements**: Milestone badges and rewards

### Farmer-Friendly Features
- Large touch targets for mobile
- Farm animal icons for visual context
- Simple, practical language
- Regional customization
- Offline-ready design

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error messages
- **CORS**: Controlled cross-origin access
- **Helmet**: Security headers

## 📊 Data Models

### Farmer Schema
```typescript
{
  id: string;
  phone: string;
  region: string;
  totalCoins: number;
  currentStreak: number;
  level: 'pupil' | 'specialist' | 'master';
  // ... more fields
}
```

### Quiz Question Schema
```typescript
{
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  animalType?: 'pig' | 'poultry' | 'cattle';
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini AI API key
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation
- Review the code examples

---

**Built with ❤️ for farmers to improve biosecurity knowledge through gamified learning.**