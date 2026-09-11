import React from 'react';
import { cn } from '@/lib/utils';

export function CoffeeCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-border bg-card animate-pulse space-y-4 rounded-xl border p-6 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="bg-muted h-4 w-20 rounded" />
        <div className="bg-muted h-5 w-14 rounded-md" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="bg-muted h-6 w-3/4 rounded-md" />
        <div className="bg-muted h-4 w-1/2 rounded" />
      </div>

      <div className="space-y-2 py-2">
        <div className="bg-muted h-3 w-full rounded" />
        <div className="bg-muted h-3 w-5/6 rounded" />
      </div>

      <div className="border-border/40 flex items-center justify-between border-t pt-4">
        <div className="bg-muted h-6 w-16 rounded" />
        <div className="bg-muted h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}
