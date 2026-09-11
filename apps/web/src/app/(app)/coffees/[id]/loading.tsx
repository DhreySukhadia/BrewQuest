import { CoffeeCardSkeleton } from '@/components';

export default function CoffeeDetailsLoading() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <CoffeeCardSkeleton />
    </div>
  );
}
