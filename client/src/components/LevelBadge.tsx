import { Badge } from "@/components/ui/badge";
import { Star, Award, Crown } from "lucide-react";

interface LevelBadgeProps {
  level: "pupil" | "specialist" | "master";
  className?: string;
}

export default function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  const levelConfig = {
    pupil: {
      icon: Star,
      label: "Pupil",
      className: "bg-level-pupil text-white"
    },
    specialist: {
      icon: Award,
      label: "Specialist", 
      className: "bg-level-specialist text-white"
    },
    master: {
      icon: Crown,
      label: "Master",
      className: "bg-level-master text-white"
    }
  };

  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <Badge 
      className={`flex items-center gap-1 ${config.className} ${className}`}
      data-testid={`badge-level-${level}`}
    >
      <Icon className="h-3 w-3" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
}