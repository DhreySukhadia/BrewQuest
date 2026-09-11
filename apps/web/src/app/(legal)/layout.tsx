import React from 'react';
import { Navbar } from '@/components';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 p-6 py-12">{children}</main>
    </div>
  );
}
