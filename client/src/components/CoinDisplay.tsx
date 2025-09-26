import { Coins } from "lucide-react";

interface CoinDisplayProps {
  coins: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export default function CoinDisplay({ 
  coins, 
  size = "md", 
  showIcon = true, 
  className = "" 
}: CoinDisplayProps) {
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
    <div className={`flex items-center gap-1 text-coin ${sizeClasses[size]} ${className}`} data-testid="coin-display">
      {showIcon && <Coins className={`${iconSizes[size]} text-coin`} data-testid="coin-icon" />}
      <span className="font-medium" data-testid="coin-amount">{coins.toLocaleString()}</span>
    </div>
  );
}