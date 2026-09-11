import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BrewQuest - AI Coffee Recommendation Platform',
  description: 'Discover your perfect coffee roast with AI recommendations.',
};

export default function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center p-8 text-center">
      <h1 className="font-display text-foreground text-4xl font-bold">BrewQuest Landing Shell</h1>
      <p className="text-muted-foreground mt-2">Public landing route architecture shell.</p>
    </div>
  );
}
