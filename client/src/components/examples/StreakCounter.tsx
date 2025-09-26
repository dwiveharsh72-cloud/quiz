import StreakCounter from '../StreakCounter';

export default function StreakCounterExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <StreakCounter streak={7} size="lg" />
      <StreakCounter streak={15} size="md" />
      <StreakCounter streak={3} size="sm" />
    </div>
  );
}