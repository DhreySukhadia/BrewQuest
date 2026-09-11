import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coffee Details | BrewQuest',
};

export default function CoffeeDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Coffee Details</h1>
      <p className="text-muted-foreground">Detailed view for coffee ID: {params.id}</p>
    </div>
  );
}
