import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  className?: string;
  backdrop?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Loading...',
  className,
  backdrop = true,
  size = 'lg',
  variant = 'primary'
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center',
        backdrop && 'bg-background/80 backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card shadow-lg border">
        <LoadingSpinner size={size} variant={variant} />
        <p className="text-sm font-medium text-foreground">{text}</p>
      </div>
    </div>
  );
};