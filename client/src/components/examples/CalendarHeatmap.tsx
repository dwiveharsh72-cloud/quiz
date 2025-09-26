import CalendarHeatmap from '../CalendarHeatmap';

// Generate mock calendar data for the past 30 days
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Simulate some completed days (70% completion rate)
    const completed = Math.random() > 0.3;
    
    data.push({
      date: dateStr,
      completed,
      streak: completed
    });
  }
  
  return data;
};

export default function CalendarHeatmapExample() {
  const mockData = generateMockData();
  const currentStreak = 7; // Mock current streak

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <CalendarHeatmap data={mockData} currentStreak={currentStreak} />
    </div>
  );
}