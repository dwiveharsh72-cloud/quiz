import CoinDisplay from '../CoinDisplay';

export default function CoinDisplayExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <CoinDisplay coins={1250} size="lg" />
      <CoinDisplay coins={500} size="md" />
      <CoinDisplay coins={100} size="sm" />
      <CoinDisplay coins={2500} size="md" showIcon={false} />
    </div>
  );
}