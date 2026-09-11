import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BrewQuest',
};

export default function TermsOfServicePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-foreground text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">
        Terms and conditions governing usage of the BrewQuest platform.
      </p>
    </div>
  );
}
