import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badgeText?: string;
  actionSlot?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  badgeText,
  actionSlot,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'border-border/40 mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        {badgeText && (
          <span className="bg-accent/15 text-accent mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">
            {badgeText}
          </span>
        )}
        <h2 className="font-display text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="text-muted-foreground max-w-2xl text-sm">{subtitle}</p>}
      </div>
      {actionSlot && <div className="shrink-0">{actionSlot}</div>}
    </div>
  );
}
