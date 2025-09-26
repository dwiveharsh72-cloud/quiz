import DailyChallenge from '../DailyChallenge';

const mockDailyQuestion = {
  id: 'daily-1',
  question: 'Which biosecurity practice is most critical when introducing new poultry to your farm?',
  options: [
    'Immediately mix them with existing birds',
    'Quarantine new birds for 2-3 weeks',
    'Give them extra feed for the first week',
    'Place them in the warmest area of the farm'
  ],
  correctAnswer: 'Quarantine new birds for 2-3 weeks',
  explanation: 'For your poultry farm, quarantining new birds for 2-3 weeks allows you to monitor them for signs of disease before introducing them to your existing flock, preventing potential disease outbreaks.',
  category: 'Biosecurity',
  animalType: 'poultry' as const
};

export default function DailyChallengeExample() {
  const handleComplete = (coinsEarned: number) => {
    console.log('Daily challenge completed! Coins earned:', coinsEarned);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Daily Challenge</h3>
        <DailyChallenge 
          question={mockDailyQuestion} 
          onComplete={handleComplete} 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Completed Daily Challenge</h3>
        <DailyChallenge 
          question={mockDailyQuestion} 
          isCompleted={true}
          onComplete={handleComplete} 
        />
      </div>
    </div>
  );
}