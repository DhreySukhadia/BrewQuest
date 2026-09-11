import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BrewQuest',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">
        Information on data collection, privacy, and protection standards.
      </p>
    </div>
  );
}
