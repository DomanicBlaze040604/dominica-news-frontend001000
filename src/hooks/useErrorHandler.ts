import { useCallback } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiError {
  success: false;
  error: string;
  details?: any;
}

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    let errorMessage = fallbackMessage;
    let errorDetails: any = null;

    // Handle different types of errors
    if (error instanceof AxiosError) {
      // API errors
      if (error.response?.data) {
        const apiError = error.response.data as ApiError;
        errorMessage = apiError.error || errorMessage;
        errorDetails = apiError.details;
      } else if (error.request) {
        // Network errors
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Request setup errors
        errorMessage = 'Request failed. Please try again.';
      }
    } else if (error instanceof Error) {
      // JavaScript errors
      errorMessage = error.message || errorMessage;
    } else if (typeof error === 'string') {
      // String errors
      errorMessage = error;
    }

    // Log error for debugging
    if (logError) {
      console.error('Error handled:', {
        error,
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }

    // Show toast notification
    if (showToast) {
      toast.error(errorMessage, {
        duration: 5000,
        action: errorDetails && import.meta.env.MODE === 'development' ? {
          label: 'Details',
          onClick: () => console.log('Error details:', errorDetails)
        } : undefined
      });
    }

    return {
      message: errorMessage,
      details: errorDetails
    };
  }, []);

  const handleApiError = useCallback((error: AxiosError, customMessage?: string) => {
    return handleError(error, {
      fallbackMessage: customMessage || 'API request failed'
    });
  }, [handleError]);

  const handleNetworkError = useCallback(() => {
    return handleError(new Error('Network connection failed'), {
      fallbackMessage: 'Please check your internet connection and try again'
    });
  }, [handleError]);

  const handleValidationError = useCallback((errors: Record<string, string[]>) => {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');
    
    return handleError(new Error(errorMessages), {
      fallbackMessage: 'Please check your input and try again'
    });
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    handleValidationError
  };
};