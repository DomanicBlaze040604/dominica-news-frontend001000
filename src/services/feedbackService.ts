import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Info, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import React from 'react';

export interface FeedbackOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
  persistent?: boolean;
}

export interface SuccessMessageConfig {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export interface ErrorMessageConfig {
  title: string;
  description: string;
  actionable: boolean;
  retryable?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
  duration?: number;
  persistent?: boolean;
}

export class FeedbackService {
  private static instance: FeedbackService;

  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  // Success Messages
  showSuccess(message: string, options?: FeedbackOptions): void {
    toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: React.createElement(CheckCircle),
    });
  }

  showArticleSuccess(operation: 'created' | 'updated' | 'deleted' | 'published' | 'scheduled', articleTitle?: string): void {
    const messages = {
      created: {
        title: articleTitle ? `Article "${articleTitle}" created successfully!` : 'Article created successfully!',
        description: 'Your article has been saved and is ready for review.',
        action: {
          label: 'View Articles',
          onClick: () => window.location.href = '/admin/articles'
        }
      },
      updated: {
        title: articleTitle ? `Article "${articleTitle}" updated successfully!` : 'Article updated successfully!',
        description: 'All changes have been saved.',
        action: {
          label: 'View Article',
          onClick: () => {
            // This would be set by the calling component
          }
        }
      },
      deleted: {
        title: articleTitle ? `Article "${articleTitle}" deleted successfully!` : 'Article deleted successfully!',
        description: 'The article has been permanently removed.',
      },
      published: {
        title: articleTitle ? `Article "${articleTitle}" published successfully!` : 'Article published successfully!',
        description: 'Your article is now live and visible to readers.',
        action: {
          label: 'View Live',
          onClick: () => {
            // This would be set by the calling component
          }
        }
      },
      scheduled: {
        title: articleTitle ? `Article "${articleTitle}" scheduled successfully!` : 'Article scheduled successfully!',
        description: 'Your article will be automatically published at the scheduled time.',
      }
    };

    const config = messages[operation];
    this.showSuccess(config.title, {
      description: config.description,
      action: 'action' in config ? config.action : undefined,
      duration: 5000
    });
  }

  showImageSuccess(operation: 'uploaded' | 'deleted' | 'updated', fileName?: string, count?: number): void {
    const messages = {
      uploaded: {
        title: count && count > 1 
          ? `${count} images uploaded successfully!` 
          : fileName 
            ? `Image "${fileName}" uploaded successfully!` 
            : 'Image uploaded successfully!',
        description: 'Your images are ready to use in articles.',
        action: {
          label: 'View Gallery',
          onClick: () => window.location.href = '/admin/images'
        }
      },
      deleted: {
        title: count && count > 1 
          ? `${count} images deleted successfully!` 
          : fileName 
            ? `Image "${fileName}" deleted successfully!` 
            : 'Image deleted successfully!',
        description: 'The images have been permanently removed.',
      },
      updated: {
        title: fileName ? `Image "${fileName}" updated successfully!` : 'Image updated successfully!',
        description: 'Image details have been saved.',
      }
    };

    const config = messages[operation];
    this.showSuccess(config.title, {
      description: config.description,
      action: 'action' in config ? config.action : undefined,
      duration: 4000
    });
  }

  showCategorySuccess(operation: 'created' | 'updated' | 'deleted', categoryName?: string): void {
    const messages = {
      created: {
        title: categoryName ? `Category "${categoryName}" created successfully!` : 'Category created successfully!',
        description: 'The new category is ready for articles.',
      },
      updated: {
        title: categoryName ? `Category "${categoryName}" updated successfully!` : 'Category updated successfully!',
        description: 'Category changes have been saved.',
      },
      deleted: {
        title: categoryName ? `Category "${categoryName}" deleted successfully!` : 'Category deleted successfully!',
        description: 'The category has been removed and articles moved to Uncategorized.',
      }
    };

    const config = messages[operation];
    this.showSuccess(config.title, {
      description: config.description,
      duration: 4000
    });
  }

  showAuthorSuccess(operation: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated', authorName?: string): void {
    const messages = {
      created: {
        title: authorName ? `Author "${authorName}" created successfully!` : 'Author created successfully!',
        description: 'The new author can now publish articles.',
      },
      updated: {
        title: authorName ? `Author "${authorName}" updated successfully!` : 'Author updated successfully!',
        description: 'Author information has been saved.',
      },
      deleted: {
        title: authorName ? `Author "${authorName}" deleted successfully!` : 'Author deleted successfully!',
        description: 'The author has been removed from the system.',
      },
      activated: {
        title: authorName ? `Author "${authorName}" activated successfully!` : 'Author activated successfully!',
        description: 'The author can now publish articles.',
      },
      deactivated: {
        title: authorName ? `Author "${authorName}" deactivated successfully!` : 'Author deactivated successfully!',
        description: 'The author can no longer publish new articles.',
      }
    };

    const config = messages[operation];
    this.showSuccess(config.title, {
      description: config.description,
      duration: 4000
    });
  }

  showUserSuccess(operation: 'created' | 'updated' | 'deleted' | 'login' | 'logout' | 'registered', userName?: string): void {
    const messages = {
      created: {
        title: userName ? `User "${userName}" created successfully!` : 'User created successfully!',
        description: 'The new user account is ready to use.',
      },
      updated: {
        title: userName ? `User "${userName}" updated successfully!` : 'User updated successfully!',
        description: 'User information has been saved.',
      },
      deleted: {
        title: userName ? `User "${userName}" deleted successfully!` : 'User deleted successfully!',
        description: 'The user account has been removed.',
      },
      login: {
        title: 'Login successful!',
        description: userName ? `Welcome back, ${userName}!` : 'Welcome back!',
      },
      logout: {
        title: 'Logged out successfully',
        description: 'You have been safely logged out.',
      },
      registered: {
        title: 'Registration successful!',
        description: userName ? `Welcome to the platform, ${userName}!` : 'Welcome to the platform!',
      }
    };

    const config = messages[operation];
    this.showSuccess(config.title, {
      description: config.description,
      duration: 4000
    });
  }

  showNavigationSuccess(message: string): void {
    this.showSuccess(message, {
      description: 'Navigation updated successfully.',
      duration: 3000
    });
  }

  showSettingsSuccess(settingType: string): void {
    this.showSuccess(`${settingType} settings updated successfully!`, {
      description: 'Your changes have been saved.',
      duration: 3000
    });
  }

  // Enhanced Error Messages with Actionable Guidance
  showError(config: ErrorMessageConfig): void {
    const actions = config.actions?.map(action => ({
      label: action.label,
      onClick: action.onClick
    }));

    toast.error(config.title, {
      description: config.description,
      duration: config.duration || (config.persistent ? Infinity : 6000),
      action: actions?.[0], // Primary action
      icon: React.createElement(AlertCircle),
    });

    // Show additional actions as separate toasts if needed
    if (actions && actions.length > 1) {
      setTimeout(() => {
        actions.slice(1).forEach(action => {
          toast.info(`Alternative: ${action.label}`, {
            duration: 4000,
            action: action
          });
        });
      }, 500);
    }
  }

  showUploadError(fileName: string, errorType: 'size' | 'format' | 'network' | 'server' | 'validation', details?: string): void {
    const errorConfigs = {
      size: {
        title: `File "${fileName}" is too large`,
        description: 'Please compress the image or choose a smaller file (max 5MB).',
        actionable: true,
        actions: [
          {
            label: 'Try Again',
            onClick: () => {
              // This would trigger a retry in the calling component
            }
          },
          {
            label: 'Learn More',
            onClick: () => window.open('/help/image-compression', '_blank')
          }
        ]
      },
      format: {
        title: `File "${fileName}" format not supported`,
        description: 'Please use JPG, PNG, or WebP format. Convert your image and try again.',
        actionable: true,
        actions: [
          {
            label: 'Try Different File',
            onClick: () => {
              // This would trigger file selection in the calling component
            }
          },
          {
            label: 'Format Guide',
            onClick: () => window.open('/help/supported-formats', '_blank')
          }
        ]
      },
      network: {
        title: `Upload failed for "${fileName}"`,
        description: 'Network connection issue. Check your internet connection and try again.',
        actionable: true,
        retryable: true,
        actions: [
          {
            label: 'Retry Upload',
            onClick: () => {
              // This would trigger a retry in the calling component
            }
          },
          {
            label: 'Check Connection',
            onClick: () => window.open('https://fast.com', '_blank')
          }
        ]
      },
      server: {
        title: `Server error during upload`,
        description: 'The server is experiencing issues. Please try again in a few moments.',
        actionable: true,
        retryable: true,
        actions: [
          {
            label: 'Try Again',
            onClick: () => {
              // This would trigger a retry in the calling component
            }
          },
          {
            label: 'Contact Support',
            onClick: () => window.location.href = '/contact'
          }
        ]
      },
      validation: {
        title: `Validation error for "${fileName}"`,
        description: details || 'The file failed validation. Please check the file and try again.',
        actionable: true,
        actions: [
          {
            label: 'Try Different File',
            onClick: () => {
              // This would trigger file selection in the calling component
            }
          }
        ]
      }
    };

    this.showError(errorConfigs[errorType]);
  }

  showNavigationError(operation: string, guidance?: string): void {
    this.showError({
      title: `Navigation ${operation} failed`,
      description: guidance || 'Please try again or refresh the page if the problem persists.',
      actionable: true,
      retryable: true,
      actions: [
        {
          label: 'Refresh Page',
          onClick: () => window.location.reload()
        },
        {
          label: 'Go Home',
          onClick: () => window.location.href = '/'
        }
      ]
    });
  }

  showFormError(fieldName: string, errorMessage: string, guidance?: string): void {
    this.showError({
      title: `${fieldName} validation failed`,
      description: guidance || errorMessage,
      actionable: true,
      actions: [
        {
          label: 'Fix and Retry',
          onClick: () => {
            // Focus would be handled by the calling component
          }
        }
      ],
      duration: 5000
    });
  }

  showConnectionError(retryCallback?: () => void): void {
    this.showError({
      title: 'Connection lost',
      description: 'Unable to connect to the server. Check your internet connection and try again.',
      actionable: true,
      retryable: true,
      actions: [
        ...(retryCallback ? [{
          label: 'Retry',
          onClick: retryCallback
        }] : []),
        {
          label: 'Check Connection',
          onClick: () => window.open('https://fast.com', '_blank')
        },
        {
          label: 'Refresh Page',
          onClick: () => window.location.reload()
        }
      ],
      persistent: true
    });
  }

  // Info and Warning Messages
  showInfo(message: string, options?: FeedbackOptions): void {
    toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      icon: React.createElement(Info),
    });
  }

  showWarning(message: string, options?: FeedbackOptions): void {
    toast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action,
      icon: React.createElement(AlertTriangle),
    });
  }

  // Loading states with feedback
  showLoading(message: string, description?: string): string {
    const toastId = toast.loading(message, {
      description,
      icon: React.createElement(RefreshCw),
    });
    return String(toastId);
  }

  dismissToast(toastId: string): void {
    toast.dismiss(toastId);
  }

  dismissAll(): void {
    toast.dismiss();
  }

  // Utility methods for common patterns
  showOperationSuccess(operation: string, itemName?: string, additionalInfo?: string): void {
    const title = itemName 
      ? `${itemName} ${operation} successfully!`
      : `${operation.charAt(0).toUpperCase() + operation.slice(1)} completed successfully!`;
    
    this.showSuccess(title, {
      description: additionalInfo,
      duration: 4000
    });
  }

  showOperationError(operation: string, itemName?: string, guidance?: string): void {
    const title = itemName 
      ? `Failed to ${operation} ${itemName}`
      : `${operation.charAt(0).toUpperCase() + operation.slice(1)} failed`;
    
    this.showError({
      title,
      description: guidance || `An error occurred while trying to ${operation}. Please try again.`,
      actionable: true,
      retryable: true,
      actions: [
        {
          label: 'Try Again',
          onClick: () => {
            // This would be handled by the calling component
          }
        }
      ]
    });
  }
}

// Export singleton instance
export const feedbackService = FeedbackService.getInstance();

// Export convenience functions
export const showSuccess = (message: string, options?: FeedbackOptions) => 
  feedbackService.showSuccess(message, options);

export const showError = (config: ErrorMessageConfig) => 
  feedbackService.showError(config);

export const showInfo = (message: string, options?: FeedbackOptions) => 
  feedbackService.showInfo(message, options);

export const showWarning = (message: string, options?: FeedbackOptions) => 
  feedbackService.showWarning(message, options);