import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UploadError {
  type: 'size' | 'format' | 'network' | 'server' | 'unknown';
  message: string;
  fileName?: string;
  fileSize?: number;
  originalError?: Error;
}

export interface UploadErrorState {
  hasError: boolean;
  error: UploadError | null;
  retryCount: number;
}

export const useUploadErrorHandler = (maxRetries: number = 3) => {
  const [errorState, setErrorState] = useState<UploadErrorState>({
    hasError: false,
    error: null,
    retryCount: 0,
  });

  const parseUploadError = useCallback((error: any, fileName?: string, fileSize?: number): UploadError => {
    let errorType: UploadError['type'] = 'unknown';
    let message = 'An unexpected error occurred during upload.';

    if (error?.message || error?.toString) {
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('size') || errorMessage.includes('large')) {
        errorType = 'size';
        message = 'File size exceeds the maximum limit.';
      } else if (errorMessage.includes('type') || errorMessage.includes('format') || errorMessage.includes('extension')) {
        errorType = 'format';
        message = 'File format is not supported.';
      } else if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
        errorType = 'network';
        message = 'Network error occurred during upload.';
      } else if (errorMessage.includes('server') || errorMessage.includes('500') || errorMessage.includes('503')) {
        errorType = 'server';
        message = 'Server error occurred during upload.';
      }
    }

    // Check response status if available
    if (error?.response?.status) {
      const status = error.response.status;
      if (status === 413) {
        errorType = 'size';
        message = 'File size exceeds the server limit.';
      } else if (status === 415) {
        errorType = 'format';
        message = 'File format is not supported by the server.';
      } else if (status >= 500) {
        errorType = 'server';
        message = 'Server error occurred during upload.';
      } else if (status === 0 || status === 408) {
        errorType = 'network';
        message = 'Network timeout occurred during upload.';
      }
    }

    return {
      type: errorType,
      message,
      fileName,
      fileSize,
      originalError: error,
    };
  }, []);

  const handleUploadError = useCallback((
    error: any, 
    fileName?: string, 
    fileSize?: number,
    showToast: boolean = true
  ) => {
    const uploadError = parseUploadError(error, fileName, fileSize);
    
    setErrorState(prev => ({
      hasError: true,
      error: uploadError,
      retryCount: prev.retryCount,
    }));

    // Show user-friendly toast notification
    if (showToast) {
      const toastMessage = getUserFriendlyMessage(uploadError);
      toast.error('Upload Failed', {
        description: toastMessage,
        duration: 5000,
      });
    }

    // Log error for debugging
    console.error('Upload error:', {
      type: uploadError.type,
      message: uploadError.message,
      fileName,
      fileSize,
      originalError: error,
    });

    return uploadError;
  }, [parseUploadError]);

  const getUserFriendlyMessage = useCallback((error: UploadError): string => {
    switch (error.type) {
      case 'size':
        return 'The file is too large. Please choose a smaller file or compress the image.';
      case 'format':
        return 'This file format is not supported. Please use JPG, PNG, or WebP format.';
      case 'network':
        return 'Upload failed due to connection issues. Please check your internet and try again.';
      case 'server':
        return 'Server is experiencing issues. Please try again in a few moments.';
      default:
        return 'Upload failed. Please try again or contact support if the problem persists.';
    }
  }, []);

  const getRetryGuidance = useCallback((error: UploadError): string => {
    switch (error.type) {
      case 'size':
        return 'Try compressing the image or choosing a smaller file.';
      case 'format':
        return 'Convert the file to JPG, PNG, or WebP format.';
      case 'network':
        return 'Check your internet connection and try again.';
      case 'server':
        return 'Wait a few minutes and try again.';
      default:
        return 'Try again or contact support if the issue persists.';
    }
  }, []);

  const canRetry = useCallback((error: UploadError): boolean => {
    // Don't retry format errors as they won't succeed without file changes
    if (error.type === 'format') return false;
    
    // Don't retry if max retries reached
    if (errorState.retryCount >= maxRetries) return false;
    
    return true;
  }, [errorState.retryCount, maxRetries]);

  const retry = useCallback(() => {
    if (errorState.retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached', {
        description: 'Please try a different file or contact support.',
      });
      return false;
    }

    setErrorState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));

    toast.info(`Retrying upload... (${errorState.retryCount + 1}/${maxRetries})`);
    return true;
  }, [errorState.retryCount, maxRetries]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  const reset = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    errorState,
    handleUploadError,
    getUserFriendlyMessage,
    getRetryGuidance,
    canRetry,
    retry,
    clearError,
    reset,
  };
};