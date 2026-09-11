import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coffee Explorer | BrewQuest',
};

export default function CoffeesExplorerPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Coffee Explorer</h1>
      <p className="text-muted-foreground">
        Browse roast origins, flavor profiles, and roaster catalogs.
      </p>
    </div>
  );
}
