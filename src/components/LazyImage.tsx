import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ImageFallback } from './ui/FallbackUI';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  useIntersectionObserver?: boolean;
  threshold?: number;
  rootMargin?: string;
  priority?: boolean;
  fallbackSrc?: string;
  showLoadingIndicator?: boolean;
  loadingText?: string;
  errorText?: string;
  retryOnError?: boolean;
  maxRetries?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  className,
  onLoad,
  onError,
  useIntersectionObserver = true,
  threshold = 0.1,
  rootMargin = '50px',
  priority = false,
  fallbackSrc,
  showLoadingIndicator = true,
  loadingText = 'Loading image...',
  errorText = 'Failed to load image',
  retryOnError = true,
  maxRetries = 2,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!useIntersectionObserver || priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Enhanced Intersection Observer for lazy loading
  useEffect(() => {
    if (!useIntersectionObserver || priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [useIntersectionObserver, priority, threshold, rootMargin]);

  // Enhanced image loading with retry logic
  const loadImage = useCallback((imageSrc: string) => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(imageSrc);
      setIsLoaded(true);
      setHasError(false);
      setIsRetrying(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      if (retryOnError && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setIsRetrying(true);
        // Retry after a short delay
        setTimeout(() => {
          loadImage(imageSrc);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else if (fallbackSrc && imageSrc !== fallbackSrc) {
        // Try fallback source
        loadImage(fallbackSrc);
      } else {
        setHasError(true);
        setIsRetrying(false);
        onError?.();
      }
    };
    
    img.src = imageSrc;
  }, [retryOnError, retryCount, maxRetries, fallbackSrc, onLoad, onError]);

  // Load the actual image when in view
  useEffect(() => {
    if (!isInView || isLoaded || (hasError && !retryOnError)) return;

    loadImage(src);
  }, [isInView, src, isLoaded, hasError, retryOnError, loadImage]);

  // Enhanced SVG placeholder with smooth transitions
  const generatePlaceholder = useCallback(() => {
    if (placeholderSrc) return placeholderSrc;
    
    // Return a simple SVG data URL for better performance
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:0" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:0" />
            <animateTransform attributeName="gradientTransform" type="translate" values="-100 0;100 0;-100 0" dur="2s" repeatCount="indefinite"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <rect width="100%" height="100%" fill="url(#shimmer)" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">${loadingText}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, [placeholderSrc, loadingText]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsRetrying(true);
    setRetryCount(0);
    loadImage(src);
  }, [src, loadImage]);

  // Enhanced error state with retry option using fallback UI
  if (hasError && !isRetrying) {
    return (
      <ImageFallback
        alt={alt}
        width={props.width || '100%'}
        height={props.height || 200}
        onRetry={retryOnError ? handleRetry : undefined}
        showRetry={retryOnError}
        className={className}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced Loading state with smooth transitions */}
      {(!isLoaded || isRetrying) && showLoadingIndicator && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-10',
            isRetrying ? 'animate-pulse' : '',
            className
          )}
          aria-label={isRetrying ? 'Retrying...' : loadingText}
        >
          <div className="text-center">
            <div 
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
              aria-label={isRetrying ? 'Retrying...' : loadingText}
            >
              <span className="sr-only">{isRetrying ? 'Retrying...' : loadingText}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {isRetrying ? `Retrying... (${retryCount}/${maxRetries})` : loadingText}
            </p>
          </div>
        </div>
      )}

      {/* Actual image with enhanced loading behavior */}
      <img
        ref={imgRef}
        src={isInView ? (currentSrc || generatePlaceholder()) : generatePlaceholder()}
        alt={alt}
        className={cn(
          'transition-all duration-500 ease-in-out',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

// Performance monitoring hook for lazy images
export const useLazyImagePerformance = (src: string) => {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    intersectionTime: number;
    totalTime: number;
  } | null>(null);

  useEffect(() => {
    if (!src) return;

    const startTime = performance.now();
    let intersectionTime = 0;
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        intersectionTime = performance.now() - startTime;
        observer.disconnect();
      }
    });

    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setMetrics({
        loadTime,
        intersectionTime,
        totalTime: loadTime
      });
    };
    
    img.src = src;
    
    return () => observer.disconnect();
  }, [src]);

  return metrics;
};

// Accessibility validation hook for lazy images
export const useLazyImageAccessibility = (alt: string, src: string) => {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const newIssues: string[] = [];

    // Validate alt text
    if (!alt) {
      newIssues.push('Missing alt text - required for screen readers');
    } else if (alt.length < 3) {
      newIssues.push('Alt text too short - should be descriptive');
    } else if (alt.length > 125) {
      newIssues.push('Alt text too long - consider shorter description');
    }

    // Check for redundant phrases
    const redundantPhrases = ['image of', 'picture of', 'photo of', 'graphic of'];
    if (redundantPhrases.some(phrase => alt.toLowerCase().includes(phrase))) {
      newIssues.push('Alt text contains redundant phrases');
    }

    // Check for decorative images
    if (alt === '' && !src.includes('decorative')) {
      newIssues.push('Empty alt text should be used only for decorative images');
    }

    setIssues(newIssues);
  }, [alt, src]);

  return issues;
};

// Hook for preloading critical images
export const useLazyImagePreload = (src: string, priority: boolean = false) => {
  useEffect(() => {
    if (!src || !priority) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    document.head.appendChild(link);
    
    return () => {
      try {
        document.head.removeChild(link);
      } catch {
        // Link may have already been removed
      }
    };
  }, [src, priority]);
};