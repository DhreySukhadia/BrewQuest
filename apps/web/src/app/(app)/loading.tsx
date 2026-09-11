import { LoadingSpinner } from '@/components';

export default function AppLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <LoadingSpinner size="lg" label="Loading application..." />
    </div>
  );
}
