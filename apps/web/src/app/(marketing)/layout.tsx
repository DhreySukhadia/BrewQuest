import React from 'react';
import { Navbar } from '@/components';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-border/40 text-muted-foreground border-t py-6 text-center text-xs">
        © {new Date().getFullYear()} BrewQuest. All rights reserved.
      </footer>
    </div>
  );
}
