import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | BrewQuest',
};

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Personalized AI recommendations and tasting overview shell.
      </p>
    </div>
  );
}
