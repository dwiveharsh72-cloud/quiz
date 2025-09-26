import QuizQuestion from '../QuizQuestion';

const mockQuestion = {
  id: '1',
  question: 'What is the most effective way to prevent African Swine Fever (ASF) transmission in your pig farm?',
  options: [
    'Regular vaccination of all pigs',
    'Strict biosecurity measures and visitor restrictions',
    'Feeding antibiotics daily',
    'Keeping pigs indoors only during winter'
  ],
  correctAnswer: 'Strict biosecurity measures and visitor restrictions',
  explanation: 'For your pig farm, implementing strict biosecurity measures including visitor restrictions, disinfection protocols, and controlling feed sources is the most effective way to prevent ASF spread, as there is currently no vaccine available.',
  category: 'ASF Prevention',
  animalType: 'pig' as const
};

export default function QuizQuestionExample() {
  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    console.log('Quiz answer submitted:', { selectedAnswer, isCorrect });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <QuizQuestion question={mockQuestion} onAnswer={handleAnswer} />
    </div>
  );
}