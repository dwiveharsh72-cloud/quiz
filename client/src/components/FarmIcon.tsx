import { Sprout, Egg, Beef } from "lucide-react";

interface FarmIconProps {
  animalType: "pig" | "poultry" | "cattle";
  className?: string;
}

export default function FarmIcon({ animalType, className = "h-6 w-6" }: FarmIconProps) {
  const icons = {
    pig: Beef,
    poultry: Egg,
    cattle: Sprout,
  };

  const Icon = icons[animalType];
  return <Icon className={className} data-testid={`icon-${animalType}`} />;
}