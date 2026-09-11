import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'accent' | 'outline' | 'roast' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium transition-colors select-none';

  const variants = {
    default: 'bg-primary/15 text-primary border border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border border-secondary/30',
    accent: 'bg-accent/15 text-accent border border-accent/20',
    outline: 'border border-border text-muted-foreground',
    roast: 'bg-coffee-800 text-coffee-100 border border-coffee-700',
    success:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] rounded-sm gap-1',
    md: 'px-2.5 py-0.5 text-xs rounded-md gap-1.5',
  };

  return (
    <div className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </div>
  );
}
