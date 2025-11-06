import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, User, Image, Upload, WifiOff, FileX } from 'lucide-react';

interface BaseFallbackProps {
  onRetry?: () => void;
  className?: string;
}

// Fallback for missing author information (Requirement 3.4)
export const AuthorFallback: React.FC<BaseFallbackProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center text-gray-500 ${className}`}>
      <User className="w-4 h-4 mr-1" />
      <span className="text-sm">Unknown Author</span>
    </div>
  );
};

// Fallback for failed image loads (Requirement 7.3)
interface ImageFallbackProps extends BaseFallbackProps {
  alt?: string;
  width?: number | string;
  height?: number | string;
  showRetry?: boolean;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({ 
  alt = 'Image unavailable', 
  width = '100%', 
  height = 200,
  onRetry,
  showRetry = true,
  className = ''
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
      style={{ width, height }}
    >
      <Image className="w-8 h-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 text-center mb-2">{alt}</p>
      <p className="text-xs text-gray-400 text-center mb-3">Image failed to load</p>
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
};

// Fallback for upload errors (Requirement 6.4)
interface UploadErrorFallbackProps extends BaseFallbackProps {
  error: string;
  fileName?: string;
  fileSize?: number;
  onRemove?: () => void;
}

export const UploadErrorFallback: React.FC<UploadErrorFallbackProps> = ({
  error,
  fileName,
  fileSize,
  onRetry,
  onRemove,
  className = ''
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('size')) {
      return 'File size exceeds the maximum limit. Please choose a smaller file.';
    }
    if (error.includes('type') || error.includes('format')) {
      return 'File type not supported. Please use JPG, PNG, or WebP format.';
    }
    if (error.includes('network') || error.includes('connection')) {
      return 'Upload failed due to network issues. Please check your connection and try again.';
    }
    if (error.includes('server')) {
      return 'Server error occurred during upload. Please try again in a few moments.';
    }
    return 'Upload failed. Please try again or contact support if the problem persists.';
  };

  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm font-medium text-red-800">
              Upload Failed
            </CardTitle>
            {fileName && (
              <CardDescription className="text-xs text-red-600">
                {fileName} {fileSize && `(${formatFileSize(fileSize)})`}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-red-700 mb-4">
          {getErrorMessage(error)}
        </p>
        <div className="flex gap-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Try Again
            </Button>
          )}
          {onRemove && (
            <Button
              onClick={onRemove}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-100"
            >
              <FileX className="w-3 h-3 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Generic network error fallback
interface NetworkErrorFallbackProps extends BaseFallbackProps {
  message?: string;
  showHomeButton?: boolean;
}

export const NetworkErrorFallback: React.FC<NetworkErrorFallbackProps> = ({
  message = "Unable to connect to the server. Please check your internet connection.",
  onRetry,
  showHomeButton = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
          >
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};

// Content loading error fallback
interface ContentErrorFallbackProps extends BaseFallbackProps {
  title?: string;
  message?: string;
  type?: 'article' | 'category' | 'general';
}

export const ContentErrorFallback: React.FC<ContentErrorFallbackProps> = ({
  title,
  message,
  type = 'general',
  onRetry,
  className = ''
}) => {
  const getDefaultTitle = () => {
    switch (type) {
      case 'article':
        return 'Article Not Found';
      case 'category':
        return 'Category Not Available';
      default:
        return 'Content Unavailable';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'article':
        return 'The article you\'re looking for might have been moved or deleted.';
      case 'category':
        return 'This category is currently unavailable or has no articles.';
      default:
        return 'The content you\'re looking for is currently unavailable.';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || getDefaultTitle()}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message || getDefaultMessage()}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        <Button 
          onClick={() => window.location.href = '/'} 
          variant="outline"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};