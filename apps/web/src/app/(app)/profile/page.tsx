import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | BrewQuest',
};

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">User Profile</h1>
      <p className="text-muted-foreground">
        Flavor preferences, favorite roasts, and coffee palate configuration.
      </p>
    </div>
  );
}
