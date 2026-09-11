import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionSlot?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actionSlot,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card/50 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed p-8 text-center sm:p-12',
        className,
      )}
      {...props}
    >
      <div className="bg-secondary text-secondary-foreground flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
        {icon || (
          <svg
            className="text-primary h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        )}
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="font-display text-foreground text-lg font-bold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      {actionSlot && <div className="pt-2">{actionSlot}</div>}
    </div>
  );
}
