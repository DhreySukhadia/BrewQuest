import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brew Log | BrewQuest',
};

export default function BrewLogPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Brew Log</h1>
      <p className="text-muted-foreground">
        Track brewing parameters, grind sizes, brew times, and tasting ratings.
      </p>
    </div>
  );
}
