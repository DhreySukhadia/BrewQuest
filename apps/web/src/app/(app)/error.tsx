'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Route Error Handler:', error);
  }, [error]);

  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-4 p-6 text-center">
      <h2 className="font-display text-destructive text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        An unforeseen error occurred while loading this section.
      </p>
      <Button variant="outline" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
