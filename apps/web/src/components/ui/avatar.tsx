'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
}

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  isOnline,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str?: string) => {
    if (!str) return '?';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const statusDotSizes = {
    sm: 'h-2 w-2 border',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-4 w-4 border-2',
  };

  return (
    <div className="relative inline-block select-none" {...props}>
      <div
        className={cn(
          'border-border bg-muted text-muted-foreground relative flex items-center justify-center overflow-hidden rounded-full border font-semibold uppercase',
          sizes[size],
          className,
        )}
      >
        {src && !imageError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={alt || name || 'User avatar'}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            'border-background absolute bottom-0 right-0 rounded-full bg-emerald-500',
            statusDotSizes[size],
          )}
        />
      )}
    </div>
  );
}
