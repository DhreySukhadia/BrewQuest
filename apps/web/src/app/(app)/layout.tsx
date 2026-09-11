import React from 'react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border bg-card border-b px-6 py-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="font-display text-primary text-xl font-bold">
            BrewQuest
          </Link>
          <div className="text-muted-foreground flex gap-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/coffees" className="hover:text-foreground">
              Explorer
            </Link>
            <Link href="/brew-log" className="hover:text-foreground">
              Brew Log
            </Link>
            <Link href="/profile" className="hover:text-foreground">
              Profile
            </Link>
            <Link href="/settings" className="hover:text-foreground">
              Settings
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-6">{children}</main>
    </div>
  );
}
