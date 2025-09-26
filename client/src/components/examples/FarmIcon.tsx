import FarmIcon from '../FarmIcon';

export default function FarmIconExample() {
  return (
    <div className="flex gap-4 p-4">
      <FarmIcon animalType="pig" className="h-8 w-8" />
      <FarmIcon animalType="poultry" className="h-8 w-8" />
      <FarmIcon animalType="cattle" className="h-8 w-8" />
    </div>
  );
}