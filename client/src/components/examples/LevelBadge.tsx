import LevelBadge from '../LevelBadge';

export default function LevelBadgeExample() {
  return (
    <div className="flex gap-4 p-4">
      <LevelBadge level="pupil" />
      <LevelBadge level="specialist" />
      <LevelBadge level="master" />
    </div>
  );
}