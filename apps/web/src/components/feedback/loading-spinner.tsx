import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label, className, ...props }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}
      {...props}
    >
      <div
        className={cn(
          'border-muted-foreground/20 border-t-primary animate-spin rounded-full',
          sizes[size],
        )}
      />
      {label && <p className="text-muted-foreground animate-pulse text-xs font-medium">{label}</p>}
    </div>
  );
}
