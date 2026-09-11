'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center space-y-4 p-6 text-center">
        <h1 className="font-display text-destructive text-4xl font-bold">Application Error</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          A critical unexpected error occurred.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors"
        >
          Reload Application
        </button>
      </body>
    </html>
  );
}
