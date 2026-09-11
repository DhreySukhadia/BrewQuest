import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | BrewQuest',
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-foreground text-2xl font-bold">Reset Password</h1>
      <p className="text-muted-foreground text-sm">
        Create a new secure password for your account.
      </p>
    </div>
  );
}
