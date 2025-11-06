import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeedback, useArticleFeedback, useImageFeedback } from '../../hooks/useFeedback';
import { FeedbackMessage, OperationFeedback } from '../ui/FeedbackMessages';

export const FeedbackDemo: React.FC = () => {
  const feedback = useFeedback();
  const articleFeedback = useArticleFeedback();
  const imageFeedback = useImageFeedback();
  const [operationStatus, setOperationStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSuccessDemo = () => {
    feedback.showSuccess('This is a success message!', {
      description: 'Your operation completed successfully.',
      duration: 4000
    });
  };

  const handleErrorDemo = () => {
    feedback.showError({
      title: 'Operation failed',
      description: 'Something went wrong. Please try again or contact support.',
      actionable: true,
      actions: [
        {
          label: 'Try Again',
          onClick: () => feedback.showInfo('Retrying operation...'),
          variant: 'default'
        },
        {
          label: 'Contact Support',
          onClick: () => feedback.showInfo('Opening support page...'),
          variant: 'outline'
        }
      ]
    });
  };

  const handleArticleDemo = () => {
    articleFeedback.showCreated('My Amazing Article');
  };

  const handleImageDemo = () => {
    imageFeedback.showUploaded('beautiful-sunset.jpg');
  };

  const handleBatchImageDemo = () => {
    imageFeedback.showUploaded(undefined, 5);
  };

  const handleUploadErrorDemo = () => {
    imageFeedback.showUploadError('large-image.jpg', 'size', 'File is 15MB');
  };

  const handleFormErrorDemo = () => {
    feedback.showFormError('Email', 'Email is required', 'Please enter a valid email address to continue.');
  };

  const handleAsyncOperationDemo = async () => {
    setOperationStatus('loading');
    const loadingId = feedback.showLoading('Processing your request...', 'Please wait while we save your changes');
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      feedback.dismissToast(loadingId);
      setOperationStatus('success');
      feedback.showSuccess('Operation completed successfully!', {
        description: 'All changes have been saved.',
        action: {
          label: 'View Results',
          onClick: () => feedback.showInfo('Results would be displayed here.')
        }
      });
    } catch (error) {
      feedback.dismissToast(loadingId);
      setOperationStatus('error');
      feedback.showError({
        title: 'Operation failed',
        description: 'An unexpected error occurred. Please try again.',
        actionable: true,
        actions: [
          {
            label: 'Retry',
            onClick: () => handleAsyncOperationDemo(),
            variant: 'default'
          }
        ]
      });
    }
  };

  const handleConnectionErrorDemo = () => {
    feedback.showConnectionError(() => {
      feedback.showInfo('Retrying connection...');
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Feedback System Demo</CardTitle>
          <CardDescription>
            Test the enhanced user feedback mechanisms with success messages and actionable error guidance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Success Messages */}
            <div className="space-y-2">
              <h3 className="font-semibold text-green-700">Success Messages</h3>
              <Button onClick={handleSuccessDemo} variant="outline" className="w-full">
                Show Success
              </Button>
              <Button onClick={handleArticleDemo} variant="outline" className="w-full">
                Article Created
              </Button>
              <Button onClick={handleImageDemo} variant="outline" className="w-full">
                Image Uploaded
              </Button>
              <Button onClick={handleBatchImageDemo} variant="outline" className="w-full">
                Batch Upload (5 images)
              </Button>
            </div>

            {/* Error Messages */}
            <div className="space-y-2">
              <h3 className="font-semibold text-red-700">Error Messages</h3>
              <Button onClick={handleErrorDemo} variant="outline" className="w-full">
                Show Error with Actions
              </Button>
              <Button onClick={handleUploadErrorDemo} variant="outline" className="w-full">
                Upload Error (Size)
              </Button>
              <Button onClick={handleFormErrorDemo} variant="outline" className="w-full">
                Form Validation Error
              </Button>
              <Button onClick={handleConnectionErrorDemo} variant="outline" className="w-full">
                Connection Error
              </Button>
            </div>

            {/* Advanced Features */}
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-700">Advanced Features</h3>
              <Button 
                onClick={handleAsyncOperationDemo} 
                variant="outline" 
                className="w-full"
                disabled={operationStatus === 'loading'}
              >
                {operationStatus === 'loading' ? 'Processing...' : 'Async Operation'}
              </Button>
              <Button onClick={() => feedback.showInfo('This is an info message')} variant="outline" className="w-full">
                Show Info
              </Button>
              <Button onClick={() => feedback.showWarning('This is a warning message')} variant="outline" className="w-full">
                Show Warning
              </Button>
              <Button onClick={() => feedback.dismissAll()} variant="destructive" className="w-full">
                Dismiss All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Static Feedback Message Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeedbackMessage
          type="success"
          title="Upload Complete"
          description="Your files have been uploaded successfully."
          actions={[
            {
              label: 'View Files',
              onClick: () => feedback.showInfo('Opening file manager...'),
              variant: 'default'
            },
            {
              label: 'Upload More',
              onClick: () => feedback.showInfo('Opening upload dialog...'),
              variant: 'outline'
            }
          ]}
          onDismiss={() => feedback.showInfo('Message dismissed')}
        />

        <FeedbackMessage
          type="error"
          title="Validation Failed"
          description="Please fix the following errors and try again."
          actions={[
            {
              label: 'Fix Errors',
              onClick: () => feedback.showInfo('Highlighting form errors...'),
              variant: 'default'
            }
          ]}
          onDismiss={() => feedback.showInfo('Error message dismissed')}
        />
      </div>

      {/* Operation Feedback Examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OperationFeedback
          operation="upload"
          status="success"
          itemName="document.pdf"
          onDismiss={() => feedback.showInfo('Success message dismissed')}
        />

        <OperationFeedback
          operation="save"
          status="error"
          itemName="article"
          onRetry={() => feedback.showInfo('Retrying save operation...')}
          details="Network connection failed"
          onDismiss={() => feedback.showInfo('Error message dismissed')}
        />

        <OperationFeedback
          operation="publish"
          status="loading"
          itemName="blog post"
        />
      </div>
    </div>
  );
};