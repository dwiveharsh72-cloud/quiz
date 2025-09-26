import BottomNavigation from '../BottomNavigation';

export default function BottomNavigationExample() {
  return (
    <div className="relative h-96 bg-background">
      <div className="p-4 h-full flex items-center justify-center">
        <p className="text-muted-foreground">Main content area - navigation is at the bottom</p>
      </div>
      <BottomNavigation />
    </div>
  );
}