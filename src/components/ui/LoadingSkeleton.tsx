import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  lines?: number;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
  lines = 1,
  width,
  height,
  animate = true
}) => {
  const baseClasses = cn(
    'bg-muted',
    animate && 'animate-pulse',
    className
  );

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rectangular':
        return 'rounded-md';
      case 'card':
        return 'rounded-lg';
      default:
        return 'rounded-md';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined)
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, getVariantClasses())}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width
            }}
            role="status"
            aria-label="Loading content"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses())}
      style={style}
      role="status"
      aria-label="Loading content"
    />
  );
};

// Predefined skeleton components for common use cases
export const ArticleCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3 p-4 border rounded-lg', className)}>
    <LoadingSkeleton variant="rectangular" height="200px" />
    <LoadingSkeleton variant="text" lines={2} />
    <div className="flex items-center gap-2">
      <LoadingSkeleton variant="circular" width="24px" height="24px" />
      <LoadingSkeleton variant="text" width="100px" />
    </div>
  </div>
);

export const NavigationSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center gap-6', className)}>
    {Array.from({ length: 5 }).map((_, index) => (
      <LoadingSkeleton key={index} variant="text" width="80px" />
    ))}
  </div>
);

export const ContentSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-4', className)}>
    <LoadingSkeleton variant="text" width="60%" height="32px" />
    <LoadingSkeleton variant="text" lines={3} />
    <LoadingSkeleton variant="rectangular" height="300px" />
    <LoadingSkeleton variant="text" lines={5} />
  </div>
);