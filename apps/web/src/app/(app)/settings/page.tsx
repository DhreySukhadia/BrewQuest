import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | BrewQuest',
};

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Account security, notifications, and theme settings.</p>
    </div>
  );
}
