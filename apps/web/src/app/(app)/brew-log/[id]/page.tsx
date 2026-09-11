import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brew Log Entry | BrewQuest',
};

export default function BrewLogDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Brew Entry Details</h1>
      <p className="text-muted-foreground">Brew log entry ID: {params.id}</p>
    </div>
  );
}
