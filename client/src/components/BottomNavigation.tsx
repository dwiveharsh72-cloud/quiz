import { Home, BookOpen, User, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface NavItem {
  path: string;
  icon: typeof Home;
  label: string;
  testId: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: Home, label: "Dashboard", testId: "nav-dashboard" },
  { path: "/quiz", icon: BookOpen, label: "Quiz", testId: "nav-quiz" },
  { path: "/leaderboard", icon: Trophy, label: "Leaderboard", testId: "nav-leaderboard" },
  { path: "/profile", icon: User, label: "Profile", testId: "nav-profile" },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50" data-testid="bottom-navigation">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 hover-elevate ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setLocation(item.path)}
              data-testid={item.testId}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}