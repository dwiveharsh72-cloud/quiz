import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayData {
  date: string;
  completed: boolean;
  streak: boolean;
}

interface CalendarHeatmapProps {
  data: DayData[];
  currentStreak: number;
}

export default function CalendarHeatmap({ data, currentStreak }: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar grid for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = data.find(d => d.date === dateStr);
      days.push({
        day,
        date: dateStr,
        completed: dayData?.completed || false,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }
    
    return days;
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };
  
  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <Card className="w-full" data-testid="calendar-heatmap">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Progress Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              data-testid="calendar-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-32 text-center" data-testid="calendar-month">{monthName}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              data-testid="calendar-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Current streak: <span className="font-semibold text-streak">{currentStreak} days</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1" data-testid="calendar-grid">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-md transition-colors
                ${!day ? '' : 
                  day.completed 
                    ? 'bg-success text-white font-semibold' 
                    : day.isToday 
                      ? 'bg-primary text-primary-foreground font-medium border-2 border-primary' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }
              `}
              data-testid={day ? `calendar-day-${day.day}` : 'calendar-empty'}
            >
              {day?.day}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span>No quiz</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary border-2 border-primary rounded"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}