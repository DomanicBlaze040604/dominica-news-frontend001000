import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { toast } from 'sonner';
import { feedbackService } from '../services/feedbackService';
import { useFeedback, useArticleFeedback, useImageFeedback } from '../hooks/useFeedback';
import { FeedbackMessage, SuccessMessage, ErrorMessage, OperationFeedback } from '../components/ui/FeedbackMessages';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('Feedback System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FeedbackService', () => {
    it('should show success messages with proper configuration', () => {
      feedbackService.showSuccess('Test success message', {
        description: 'Test description',
        duration: 5000
      });

      expect(toast.success).toHaveBeenCalledWith('Test success message', {
        duration: 5000,
        description: 'Test description',
        action: undefined,
        icon: expect.any(Function),
      });
    });

    it('should show article success messages with proper titles', () => {
      feedbackService.showArticleSuccess('created', 'Test Article');

      expect(toast.success).toHaveBeenCalledWith(
        'Article "Test Article" created successfully!',
        expect.objectContaining({
          description: 'Your article has been saved and is ready for review.',
          duration: 5000
        })
      );
    });

    it('should show image success messages for batch uploads', () => {
      feedbackService.showImageSuccess('uploaded', undefined, 3);

      expect(toast.success).toHaveBeenCalledWith(
        '3 images uploaded successfully!',
        expect.objectContaining({
          description: 'Your images are ready to use in articles.',
          duration: 4000
        })
      );
    });

    it('should show enhanced error messages with actionable guidance', () => {
      feedbackService.showUploadError('test.jpg', 'size', 'File is 10MB');

      expect(toast.error).toHaveBeenCalledWith(
        'File "test.jpg" is too large',
        expect.objectContaining({
          description: 'Please compress the image or choose a smaller file (max 5MB).',
          duration: 6000
        })
      );
    });

    it('should show form validation errors with guidance', () => {
      feedbackService.showFormError('Title', 'Title is required', 'Please enter a descriptive title');

      expect(toast.error).toHaveBeenCalledWith(
        'Title validation failed',
        expect.objectContaining({
          description: 'Please enter a descriptive title',
          duration: 5000
        })
      );
    });

    it('should show connection errors with retry options', () => {
      const retryCallback = vi.fn();
      feedbackService.showConnectionError(retryCallback);

      expect(toast.error).toHaveBeenCalledWith(
        'Connection lost',
        expect.objectContaining({
          description: 'Unable to connect to the server. Check your internet connection and try again.',
          persistent: true
        })
      );
    });
  });

  describe('useFeedback Hook', () => {
    const TestComponent = () => {
      const feedback = useFeedback();
      
      return (
        <div>
          <button onClick={() => feedback.showSuccess('Test success')}>
            Show Success
          </button>
          <button onClick={() => feedback.showError({
            title: 'Test Error',
            description: 'Test error description',
            actionable: true
          })}>
            Show Error
          </button>
          <button onClick={() => feedback.showUploadError('test.jpg', 'format')}>
            Show Upload Error
          </button>
        </div>
      );
    };

    it('should provide success feedback methods', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Success'));
      
      expect(toast.success).toHaveBeenCalledWith('Test success', expect.any(Object));
    });

    it('should provide error feedback methods', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Error'));
      
      expect(toast.error).toHaveBeenCalledWith('Test Error', expect.objectContaining({
        description: 'Test error description'
      }));
    });

    it('should provide upload error feedback', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Upload Error'));
      
      expect(toast.error).toHaveBeenCalledWith(
        'File "test.jpg" format not supported',
        expect.objectContaining({
          description: 'Please use JPG, PNG, or WebP format. Convert your image and try again.'
        })
      );
    });
  });

  describe('useArticleFeedback Hook', () => {
    const TestComponent = () => {
      const articleFeedback = useArticleFeedback();
      
      return (
        <div>
          <button onClick={() => articleFeedback.showCreated('Test Article')}>
            Show Created
          </button>
          <button onClick={() => articleFeedback.showPublished('Test Article')}>
            Show Published
          </button>
          <button onClick={() => articleFeedback.showError('create', 'Test Article', 'Validation failed')}>
            Show Error
          </button>
        </div>
      );
    };

    it('should show article creation success', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Created'));
      
      expect(toast.success).toHaveBeenCalledWith(
        'Article "Test Article" created successfully!',
        expect.objectContaining({
          description: 'Your article has been saved and is ready for review.'
        })
      );
    });

    it('should show article publication success', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Published'));
      
      expect(toast.success).toHaveBeenCalledWith(
        'Article "Test Article" published successfully!',
        expect.objectContaining({
          description: 'Your article is now live and visible to readers.'
        })
      );
    });

    it('should show article operation errors', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Error'));
      
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create Test Article',
        expect.objectContaining({
          description: 'Validation failed'
        })
      );
    });
  });

  describe('useImageFeedback Hook', () => {
    const TestComponent = () => {
      const imageFeedback = useImageFeedback();
      
      return (
        <div>
          <button onClick={() => imageFeedback.showUploaded('test.jpg')}>
            Show Uploaded
          </button>
          <button onClick={() => imageFeedback.showUploaded(undefined, 5)}>
            Show Batch Uploaded
          </button>
          <button onClick={() => imageFeedback.showUploadError('test.jpg', 'network')}>
            Show Upload Error
          </button>
        </div>
      );
    };

    it('should show single image upload success', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Uploaded'));
      
      expect(toast.success).toHaveBeenCalledWith(
        'Image "test.jpg" uploaded successfully!',
        expect.objectContaining({
          description: 'Your images are ready to use in articles.'
        })
      );
    });

    it('should show batch image upload success', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Batch Uploaded'));
      
      expect(toast.success).toHaveBeenCalledWith(
        '5 images uploaded successfully!',
        expect.objectContaining({
          description: 'Your images are ready to use in articles.'
        })
      );
    });

    it('should show upload error with network guidance', async () => {
      render(<TestComponent />);
      
      fireEvent.click(screen.getByText('Show Upload Error'));
      
      expect(toast.error).toHaveBeenCalledWith(
        'Upload failed for "test.jpg"',
        expect.objectContaining({
          description: 'Network connection issue. Check your internet connection and try again.'
        })
      );
    });
  });

  describe('FeedbackMessage Component', () => {
    it('should render success message with actions', () => {
      const mockAction = vi.fn();
      const mockDismiss = vi.fn();

      render(
        <FeedbackMessage
          type="success"
          title="Success Title"
          description="Success description"
          actions={[
            { label: 'Action 1', onClick: mockAction, variant: 'default' }
          ]}
          onDismiss={mockDismiss}
        />
      );

      expect(screen.getByText('Success Title')).toBeInTheDocument();
      expect(screen.getByText('Success description')).toBeInTheDocument();
      expect(screen.getByText('Action 1')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Action 1'));
      expect(mockAction).toHaveBeenCalled();
    });

    it('should render error message with proper styling', () => {
      render(
        <FeedbackMessage
          type="error"
          title="Error Title"
          description="Error description"
        />
      );

      const container = screen.getByText('Error Title').closest('div');
      expect(container).toHaveClass('border-red-200', 'bg-red-50', 'text-red-800');
    });

    it('should render compact version', () => {
      render(
        <FeedbackMessage
          type="info"
          title="Info Title"
          compact={true}
        />
      );

      expect(screen.getByText('Info Title')).toBeInTheDocument();
      // Compact version should not use Card components
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('OperationFeedback Component', () => {
    it('should show upload success feedback', () => {
      render(
        <OperationFeedback
          operation="upload"
          status="success"
          itemName="test.jpg"
        />
      );

      expect(screen.getByText('Upload successful!')).toBeInTheDocument();
      expect(screen.getByText('test.jpg has been uploadd successfully.')).toBeInTheDocument();
    });

    it('should show upload error with retry button', () => {
      const mockRetry = vi.fn();

      render(
        <OperationFeedback
          operation="upload"
          status="error"
          itemName="test.jpg"
          onRetry={mockRetry}
          details="Network error occurred"
        />
      );

      expect(screen.getByText('Upload failed')).toBeInTheDocument();
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
      
      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(mockRetry).toHaveBeenCalled();
    });

    it('should show loading state', () => {
      render(
        <OperationFeedback
          operation="save"
          status="loading"
          itemName="article"
        />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.getByText('Please wait while we save article.')).toBeInTheDocument();
    });
  });

  describe('Integration with Components', () => {
    it('should integrate with form validation', async () => {
      const TestForm = () => {
        const feedback = useFeedback();
        
        const handleSubmit = () => {
          feedback.showFormError('Email', 'Email is required', 'Please enter a valid email address');
        };

        return (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <button type="submit">Submit</button>
          </form>
        );
      };

      render(<TestForm />);
      
      fireEvent.click(screen.getByText('Submit'));
      
      expect(toast.error).toHaveBeenCalledWith(
        'Email validation failed',
        expect.objectContaining({
          description: 'Please enter a valid email address'
        })
      );
    });

    it('should integrate with async operations', async () => {
      const TestAsyncComponent = () => {
        const feedback = useFeedback();
        
        const handleAsyncOperation = async () => {
          const loadingId = feedback.showLoading('Processing...', 'Please wait');
          
          try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 100));
            feedback.dismissToast(loadingId);
            feedback.showSuccess('Operation completed successfully!');
          } catch (error) {
            feedback.dismissToast(loadingId);
            feedback.showError({
              title: 'Operation failed',
              description: 'Please try again',
              actionable: true
            });
          }
        };

        return (
          <button onClick={handleAsyncOperation}>
            Start Operation
          </button>
        );
      };

      render(<TestAsyncComponent />);
      
      fireEvent.click(screen.getByText('Start Operation'));
      
      expect(toast.loading).toHaveBeenCalledWith('Processing...', {
        description: 'Please wait',
        icon: expect.any(Function)
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Operation completed successfully!',
          expect.any(Object)
        );
      });
    });
  });
});