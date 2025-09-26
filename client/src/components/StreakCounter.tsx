import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StreakCounter({ 
  streak, 
  size = "md", 
  className = "" 
}: StreakCounterProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`} data-testid="streak-counter">
      <Flame className={`${iconSizes[size]} text-streak`} data-testid="streak-icon" />
      <span className="font-medium text-streak" data-testid="streak-number">{streak}</span>
      <span className="text-muted-foreground text-sm">day streak</span>
    </div>
  );
}