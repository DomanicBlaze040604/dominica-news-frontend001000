import { useCallback } from 'react';
import { feedbackService, FeedbackOptions, ErrorMessageConfig } from '../services/feedbackService';

export interface UseFeedbackReturn {
  // Success messages
  showSuccess: (message: string, options?: FeedbackOptions) => void;
  showArticleSuccess: (operation: 'created' | 'updated' | 'deleted' | 'published' | 'scheduled', articleTitle?: string) => void;
  showImageSuccess: (operation: 'uploaded' | 'deleted' | 'updated', fileName?: string, count?: number) => void;
  showCategorySuccess: (operation: 'created' | 'updated' | 'deleted', categoryName?: string) => void;
  showAuthorSuccess: (operation: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated', authorName?: string) => void;
  showUserSuccess: (operation: 'created' | 'updated' | 'deleted' | 'login' | 'logout' | 'registered', userName?: string) => void;
  showNavigationSuccess: (message: string) => void;
  showSettingsSuccess: (settingType: string) => void;
  showOperationSuccess: (operation: string, itemName?: string, additionalInfo?: string) => void;

  // Error messages
  showError: (config: ErrorMessageConfig) => void;
  showUploadError: (fileName: string, errorType: 'size' | 'format' | 'network' | 'server' | 'validation', details?: string) => void;
  showNavigationError: (operation: string, guidance?: string) => void;
  showFormError: (fieldName: string, errorMessage: string, guidance?: string) => void;
  showConnectionError: (retryCallback?: () => void) => void;
  showOperationError: (operation: string, itemName?: string, guidance?: string) => void;

  // Info and warning messages
  showInfo: (message: string, options?: FeedbackOptions) => void;
  showWarning: (message: string, options?: FeedbackOptions) => void;

  // Loading states
  showLoading: (message: string, description?: string) => string;
  dismissToast: (toastId: string) => void;
  dismissAll: () => void;
}

export const useFeedback = (): UseFeedbackReturn => {
  // Success messages
  const showSuccess = useCallback((message: string, options?: FeedbackOptions) => {
    feedbackService.showSuccess(message, options);
  }, []);

  const showArticleSuccess = useCallback((
    operation: 'created' | 'updated' | 'deleted' | 'published' | 'scheduled', 
    articleTitle?: string
  ) => {
    feedbackService.showArticleSuccess(operation, articleTitle);
  }, []);

  const showImageSuccess = useCallback((
    operation: 'uploaded' | 'deleted' | 'updated', 
    fileName?: string, 
    count?: number
  ) => {
    feedbackService.showImageSuccess(operation, fileName, count);
  }, []);

  const showCategorySuccess = useCallback((
    operation: 'created' | 'updated' | 'deleted', 
    categoryName?: string
  ) => {
    feedbackService.showCategorySuccess(operation, categoryName);
  }, []);

  const showAuthorSuccess = useCallback((
    operation: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated', 
    authorName?: string
  ) => {
    feedbackService.showAuthorSuccess(operation, authorName);
  }, []);

  const showUserSuccess = useCallback((
    operation: 'created' | 'updated' | 'deleted' | 'login' | 'logout' | 'registered', 
    userName?: string
  ) => {
    feedbackService.showUserSuccess(operation, userName);
  }, []);

  const showNavigationSuccess = useCallback((message: string) => {
    feedbackService.showNavigationSuccess(message);
  }, []);

  const showSettingsSuccess = useCallback((settingType: string) => {
    feedbackService.showSettingsSuccess(settingType);
  }, []);

  const showOperationSuccess = useCallback((
    operation: string, 
    itemName?: string, 
    additionalInfo?: string
  ) => {
    feedbackService.showOperationSuccess(operation, itemName, additionalInfo);
  }, []);

  // Error messages
  const showError = useCallback((config: ErrorMessageConfig) => {
    feedbackService.showError(config);
  }, []);

  const showUploadError = useCallback((
    fileName: string, 
    errorType: 'size' | 'format' | 'network' | 'server' | 'validation', 
    details?: string
  ) => {
    feedbackService.showUploadError(fileName, errorType, details);
  }, []);

  const showNavigationError = useCallback((operation: string, guidance?: string) => {
    feedbackService.showNavigationError(operation, guidance);
  }, []);

  const showFormError = useCallback((
    fieldName: string, 
    errorMessage: string, 
    guidance?: string
  ) => {
    feedbackService.showFormError(fieldName, errorMessage, guidance);
  }, []);

  const showConnectionError = useCallback((retryCallback?: () => void) => {
    feedbackService.showConnectionError(retryCallback);
  }, []);

  const showOperationError = useCallback((
    operation: string, 
    itemName?: string, 
    guidance?: string
  ) => {
    feedbackService.showOperationError(operation, itemName, guidance);
  }, []);

  // Info and warning messages
  const showInfo = useCallback((message: string, options?: FeedbackOptions) => {
    feedbackService.showInfo(message, options);
  }, []);

  const showWarning = useCallback((message: string, options?: FeedbackOptions) => {
    feedbackService.showWarning(message, options);
  }, []);

  // Loading states
  const showLoading = useCallback((message: string, description?: string) => {
    return feedbackService.showLoading(message, description);
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    feedbackService.dismissToast(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    feedbackService.dismissAll();
  }, []);

  return {
    showSuccess,
    showArticleSuccess,
    showImageSuccess,
    showCategorySuccess,
    showAuthorSuccess,
    showUserSuccess,
    showNavigationSuccess,
    showSettingsSuccess,
    showOperationSuccess,
    showError,
    showUploadError,
    showNavigationError,
    showFormError,
    showConnectionError,
    showOperationError,
    showInfo,
    showWarning,
    showLoading,
    dismissToast,
    dismissAll,
  };
};

// Convenience hooks for specific operations
export const useArticleFeedback = () => {
  const { showArticleSuccess, showOperationError } = useFeedback();
  
  return {
    showCreated: (title?: string) => showArticleSuccess('created', title),
    showUpdated: (title?: string) => showArticleSuccess('updated', title),
    showDeleted: (title?: string) => showArticleSuccess('deleted', title),
    showPublished: (title?: string) => showArticleSuccess('published', title),
    showScheduled: (title?: string) => showArticleSuccess('scheduled', title),
    showError: (operation: string, title?: string, guidance?: string) => 
      showOperationError(operation, title, guidance),
  };
};

export const useImageFeedback = () => {
  const { showImageSuccess, showUploadError, showOperationError } = useFeedback();
  
  return {
    showUploaded: (fileName?: string, count?: number) => showImageSuccess('uploaded', fileName, count),
    showDeleted: (fileName?: string, count?: number) => showImageSuccess('deleted', fileName, count),
    showUpdated: (fileName?: string) => showImageSuccess('updated', fileName),
    showUploadError: (fileName: string, errorType: 'size' | 'format' | 'network' | 'server' | 'validation', details?: string) => 
      showUploadError(fileName, errorType, details),
    showError: (operation: string, fileName?: string, guidance?: string) => 
      showOperationError(operation, fileName, guidance),
  };
};

export const useNavigationFeedback = () => {
  const { showNavigationSuccess, showNavigationError } = useFeedback();
  
  return {
    showSuccess: (message: string) => showNavigationSuccess(message),
    showError: (operation: string, guidance?: string) => showNavigationError(operation, guidance),
  };
};

export const useFormFeedback = () => {
  const { showFormError, showSuccess, showOperationError } = useFeedback();
  
  return {
    showFieldError: (fieldName: string, errorMessage: string, guidance?: string) => 
      showFormError(fieldName, errorMessage, guidance),
    showSubmitSuccess: (formName: string) => 
      showSuccess(`${formName} submitted successfully!`),
    showSubmitError: (formName: string, guidance?: string) => 
      showOperationError('submit', formName, guidance),
  };
};