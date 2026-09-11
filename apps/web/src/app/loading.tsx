import { LoadingSpinner } from '@/components';

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <LoadingSpinner size="lg" label="Initializing BrewQuest..." />
    </div>
  );
}
