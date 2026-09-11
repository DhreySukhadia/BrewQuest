import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | BrewQuest',
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-foreground text-2xl font-bold">Forgot Password</h1>
      <p className="text-muted-foreground text-sm">
        Enter your email to receive password reset instructions.
      </p>
    </div>
  );
}
