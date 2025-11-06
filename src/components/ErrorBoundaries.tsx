import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { 
  AuthorFallback, 
  ImageFallback, 
  UploadErrorFallback, 
  NetworkErrorFallback, 
  ContentErrorFallback 
} from './ui/FallbackUI';

// Article-specific error boundary
interface ArticleErrorBoundaryProps {
  children: ReactNode;
}

export const ArticleErrorBoundary: React.FC<ArticleErrorBoundaryProps> = ({ children }) => {
  const fallback = (
    <ContentErrorFallback
      type="article"
      onRetry={() => window.location.reload()}
      className="min-h-[400px]"
    />
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={true}
      maxRetries={2}
    >
      {children}
    </ErrorBoundary>
  );
};

// Navigation-specific error boundary
interface NavigationErrorBoundaryProps {
  children: ReactNode;
}

export const NavigationErrorBoundary: React.FC<NavigationErrorBoundaryProps> = ({ children }) => {
  const fallback = (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <p className="text-sm text-red-700">
        Navigation temporarily unavailable. Please refresh the page.
      </p>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={true}
      maxRetries={1}
    >
      {children}
    </ErrorBoundary>
  );
};

// Image-specific error boundary
interface ImageErrorBoundaryProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  alt?: string;
}

export const ImageErrorBoundary: React.FC<ImageErrorBoundaryProps> = ({ 
  children, 
  width, 
  height, 
  alt 
}) => {
  const fallback = (
    <ImageFallback
      width={width}
      height={height}
      alt={alt}
      onRetry={() => window.location.reload()}
    />
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={false}
    >
      {children}
    </ErrorBoundary>
  );
};

// Admin panel-specific error boundary
interface AdminErrorBoundaryProps {
  children: ReactNode;
}

export const AdminErrorBoundary: React.FC<AdminErrorBoundaryProps> = ({ children }) => {
  const fallback = (
    <div className="min-h-[400px] flex items-center justify-center">
      <ContentErrorFallback
        title="Admin Panel Error"
        message="An error occurred in the admin panel. Please try refreshing the page."
        onRetry={() => window.location.reload()}
      />
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={true}
      maxRetries={3}
      showReportButton={true}
    >
      {children}
    </ErrorBoundary>
  );
};

// Category page-specific error boundary
interface CategoryErrorBoundaryProps {
  children: ReactNode;
  categoryName?: string;
}

export const CategoryErrorBoundary: React.FC<CategoryErrorBoundaryProps> = ({ 
  children, 
  categoryName 
}) => {
  const fallback = (
    <ContentErrorFallback
      type="category"
      title={categoryName ? `${categoryName} Category Error` : undefined}
      onRetry={() => window.location.reload()}
      className="min-h-[400px]"
    />
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={true}
      maxRetries={2}
    >
      {children}
    </ErrorBoundary>
  );
};

// Social media section error boundary
interface SocialMediaErrorBoundaryProps {
  children: ReactNode;
}

export const SocialMediaErrorBoundary: React.FC<SocialMediaErrorBoundaryProps> = ({ children }) => {
  const fallback = (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
      <p className="text-sm text-gray-600">
        Social media links temporarily unavailable
      </p>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={false}
    >
      {children}
    </ErrorBoundary>
  );
};

// Homepage section error boundary
interface HomepageSectionErrorBoundaryProps {
  children: ReactNode;
  sectionName?: string;
}

export const HomepageSectionErrorBoundary: React.FC<HomepageSectionErrorBoundaryProps> = ({ 
  children, 
  sectionName 
}) => {
  const fallback = (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
      <p className="text-sm text-yellow-800 mb-2">
        {sectionName ? `${sectionName} section` : 'This section'} is temporarily unavailable
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="text-xs text-yellow-700 underline hover:no-underline"
      >
        Refresh page
      </button>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={true}
      maxRetries={1}
    >
      {children}
    </ErrorBoundary>
  );
};

// Network operation error boundary (for API calls)
interface NetworkErrorBoundaryProps {
  children: ReactNode;
  operation?: string;
}

export const NetworkErrorBoundary: React.FC<NetworkErrorBoundaryProps> = ({ 
  children, 
  operation = 'operation' 
}) => {
  const fallback = (
    <NetworkErrorFallback
      message={`Failed to complete ${operation}. Please check your connection and try again.`}
      onRetry={() => window.location.reload()}
    />
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      enableRetry={true}
      maxRetries={3}
    >
      {children}
    </ErrorBoundary>
  );
};