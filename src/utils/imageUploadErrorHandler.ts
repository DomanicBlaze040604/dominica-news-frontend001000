import { toast } from 'sonner';

export interface ImageUploadError {
  code: string;
  message: string;
  retryable: boolean;
  details?: any;
}

export class ImageUploadErrorHandler {
  private static readonly ERROR_CODES = {
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    UPLOAD_TIMEOUT: 'UPLOAD_TIMEOUT',
    CORRUPTED_FILE: 'CORRUPTED_FILE',
    MISSING_ALT_TEXT: 'MISSING_ALT_TEXT',
    FILENAME_TOO_LONG: 'FILENAME_TOO_LONG',
  };

  static handleError(error: any, fileName?: string): ImageUploadError {
    let uploadError: ImageUploadError;

    // Network errors
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      uploadError = {
        code: this.ERROR_CODES.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        retryable: true,
        details: error
      };
    }
    // Server errors (5xx)
    else if (error.response?.status >= 500) {
      uploadError = {
        code: this.ERROR_CODES.SERVER_ERROR,
        message: 'Server error occurred. Please try again in a moment.',
        retryable: true,
        details: error.response
      };
    }
    // Client errors (4xx)
    else if (error.response?.status >= 400) {
      const errorData = error.response.data;
      
      switch (error.response.status) {
        case 413: // Payload too large
          uploadError = {
            code: this.ERROR_CODES.FILE_TOO_LARGE,
            message: 'File is too large. Please choose a smaller image.',
            retryable: false,
            details: errorData
          };
          break;
        case 415: // Unsupported media type
          uploadError = {
            code: this.ERROR_CODES.INVALID_FILE_TYPE,
            message: 'File type not supported. Please use JPEG, PNG, or WebP images.',
            retryable: false,
            details: errorData
          };
          break;
        case 422: // Validation error
          uploadError = {
            code: this.ERROR_CODES.VALIDATION_ERROR,
            message: errorData?.error || 'File validation failed. Please check your image.',
            retryable: false,
            details: errorData
          };
          break;
        case 429: // Too many requests / quota exceeded
          uploadError = {
            code: this.ERROR_CODES.QUOTA_EXCEEDED,
            message: 'Upload quota exceeded. Please try again later.',
            retryable: true,
            details: errorData
          };
          break;
        default:
          uploadError = {
            code: this.ERROR_CODES.SERVER_ERROR,
            message: errorData?.error || 'Upload failed. Please try again.',
            retryable: false,
            details: errorData
          };
      }
    }
    // Timeout errors
    else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      uploadError = {
        code: this.ERROR_CODES.UPLOAD_TIMEOUT,
        message: 'Upload timed out. Please try again with a smaller image.',
        retryable: true,
        details: error
      };
    }
    // Unknown errors
    else {
      uploadError = {
        code: this.ERROR_CODES.SERVER_ERROR,
        message: error.message || 'An unexpected error occurred during upload.',
        retryable: false,
        details: error
      };
    }

    // Log error for debugging
    console.error('Image upload error:', {
      fileName,
      error: uploadError,
      originalError: error
    });

    return uploadError;
  }

  static validateFile(file: File, options: {
    maxSize?: number;
    acceptedTypes?: string[];
    maxFilenameLength?: number;
  } = {}): ImageUploadError | null {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxFilenameLength = 255
    } = options;

    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        code: this.ERROR_CODES.INVALID_FILE_TYPE,
        message: 'Please select an image file.',
        retryable: false
      };
    }

    // Check specific image types
    if (!acceptedTypes.includes(file.type)) {
      const formatNames = acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
      return {
        code: this.ERROR_CODES.INVALID_FILE_TYPE,
        message: `Only ${formatNames} images are allowed.`,
        retryable: false
      };
    }

    // Check file size
    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        code: this.ERROR_CODES.FILE_TOO_LARGE,
        message: `File size must be less than ${sizeMB}MB.`,
        retryable: false
      };
    }

    // Check filename length
    if (file.name.length > maxFilenameLength) {
      return {
        code: this.ERROR_CODES.FILENAME_TOO_LONG,
        message: `File name is too long (max ${maxFilenameLength} characters).`,
        retryable: false
      };
    }

    // Check for corrupted files (basic check)
    if (file.size === 0) {
      return {
        code: this.ERROR_CODES.CORRUPTED_FILE,
        message: 'File appears to be corrupted or empty.',
        retryable: false
      };
    }

    return null;
  }

  static validateAltText(altText: string): ImageUploadError | null {
    if (!altText.trim()) {
      return {
        code: this.ERROR_CODES.MISSING_ALT_TEXT,
        message: 'Alt text is required for accessibility.',
        retryable: true
      };
    }

    if (altText.trim().length < 3) {
      return {
        code: this.ERROR_CODES.MISSING_ALT_TEXT,
        message: 'Alt text must be at least 3 characters long.',
        retryable: true
      };
    }

    return null;
  }

  static showErrorToast(error: ImageUploadError, fileName?: string): void {
    const message = fileName ? `${fileName}: ${error.message}` : error.message;
    
    if (error.retryable) {
      toast.error(message, {
        description: 'You can try uploading again.',
        action: {
          label: 'Retry',
          onClick: () => {
            // This will be handled by the component
          }
        }
      });
    } else {
      toast.error(message, {
        description: 'Please fix the issue and try again.'
      });
    }
  }

  static getRetryDelay(attemptNumber: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, attemptNumber), 10000);
  }

  static shouldRetry(error: ImageUploadError, attemptNumber: number, maxRetries: number = 3): boolean {
    return error.retryable && attemptNumber < maxRetries;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}