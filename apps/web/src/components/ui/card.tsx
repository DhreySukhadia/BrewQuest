import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'glass' | 'interactive';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'border border-border bg-card text-card-foreground shadow-sm',
    outline: 'border border-border bg-transparent text-foreground',
    glass: 'glass-card shadow-coffee text-card-foreground',
    interactive:
      'border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-coffee hover:-translate-y-0.5 cursor-pointer',
  };

  return (
    <div className={cn('overflow-hidden rounded-xl', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-display text-foreground text-xl font-bold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-muted-foreground text-sm leading-relaxed', className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-border/40 mt-auto flex items-center border-t p-6 pt-0', className)}
      {...props}
    />
  );
}
