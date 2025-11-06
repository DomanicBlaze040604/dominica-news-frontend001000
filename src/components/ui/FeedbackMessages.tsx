import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  X,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeedbackMessageProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
    icon?: React.ReactNode;
  }>;
  onDismiss?: () => void;
  persistent?: boolean;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  title,
  description,
  actions = [],
  onDismiss,
  persistent = false,
  className = '',
  showIcon = true,
  compact = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'loading':
        return <RefreshCw className="h-5 w-5 text-gray-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'loading':
        return 'border-gray-200 bg-gray-50 text-gray-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-lg border',
        getColorClasses(),
        className
      )}>
        {showIcon && getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="text-xs opacity-90 mt-1">{description}</p>
          )}
        </div>
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.slice(0, 2).map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || 'outline'}
                size="sm"
                className="text-xs h-7"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
        {onDismiss && !persistent && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('border', getColorClasses(), className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {showIcon && getIcon()}
            <div>
              <CardTitle className="text-base font-semibold">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-sm mt-1 opacity-90">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {onDismiss && !persistent && (
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      {actions.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || 'outline'}
                size="sm"
                className="text-sm"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Success Message Components
export const SuccessMessage: React.FC<Omit<FeedbackMessageProps, 'type'>> = (props) => (
  <FeedbackMessage {...props} type="success" />
);

export const ErrorMessage: React.FC<Omit<FeedbackMessageProps, 'type'>> = (props) => (
  <FeedbackMessage {...props} type="error" />
);

export const WarningMessage: React.FC<Omit<FeedbackMessageProps, 'type'>> = (props) => (
  <FeedbackMessage {...props} type="warning" />
);

export const InfoMessage: React.FC<Omit<FeedbackMessageProps, 'type'>> = (props) => (
  <FeedbackMessage {...props} type="info" />
);

export const LoadingMessage: React.FC<Omit<FeedbackMessageProps, 'type'>> = (props) => (
  <FeedbackMessage {...props} type="loading" />
);

// Specialized feedback components for common operations
interface OperationFeedbackProps {
  operation: 'upload' | 'save' | 'delete' | 'publish' | 'update';
  status: 'success' | 'error' | 'loading';
  itemName?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  details?: string;
  className?: string;
}

export const OperationFeedback: React.FC<OperationFeedbackProps> = ({
  operation,
  status,
  itemName,
  onRetry,
  onDismiss,
  details,
  className
}) => {
  const getOperationMessages = () => {
    const operationLabels = {
      upload: 'Upload',
      save: 'Save',
      delete: 'Delete',
      publish: 'Publish',
      update: 'Update'
    };

    const label = operationLabels[operation];
    const item = itemName || 'item';

    switch (status) {
      case 'success':
        return {
          title: `${label} successful!`,
          description: `${item} has been ${operation}d successfully.`,
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'error':
        return {
          title: `${label} failed`,
          description: details || `Failed to ${operation} ${item}. Please try again.`,
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'loading':
        return {
          title: `${operation.charAt(0).toUpperCase() + operation.slice(1)}ing...`,
          description: `Please wait while we ${operation} ${item}.`,
          icon: <RefreshCw className="h-4 w-4 animate-spin" />
        };
      default:
        return {
          title: `${label} ${status}`,
          description: details,
          icon: <Info className="h-4 w-4" />
        };
    }
  };

  const { title, description, icon } = getOperationMessages();

  const actions = [];
  if (status === 'error' && onRetry) {
    actions.push({
      label: 'Try Again',
      onClick: onRetry,
      variant: 'default' as const,
      icon: <RefreshCw className="h-3 w-3" />
    });
  }

  return (
    <FeedbackMessage
      type={status === 'loading' ? 'loading' : status}
      title={title}
      description={description}
      actions={actions}
      onDismiss={onDismiss}
      className={className}
      compact={true}
    />
  );
};

// Batch operation feedback
interface BatchOperationFeedbackProps {
  operation: string;
  total: number;
  completed: number;
  failed: number;
  onRetryFailed?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const BatchOperationFeedback: React.FC<BatchOperationFeedbackProps> = ({
  operation,
  total,
  completed,
  failed,
  onRetryFailed,
  onDismiss,
  className
}) => {
  const isComplete = completed + failed === total;
  const hasFailures = failed > 0;
  const isSuccess = isComplete && !hasFailures;
  const isPartialSuccess = isComplete && hasFailures && completed > 0;

  const getStatus = () => {
    if (!isComplete) return 'loading';
    if (isSuccess) return 'success';
    if (isPartialSuccess) return 'warning';
    return 'error';
  };

  const getTitle = () => {
    if (!isComplete) {
      return `${operation} in progress...`;
    }
    if (isSuccess) {
      return `${operation} completed successfully!`;
    }
    if (isPartialSuccess) {
      return `${operation} partially completed`;
    }
    return `${operation} failed`;
  };

  const getDescription = () => {
    if (!isComplete) {
      return `${completed} of ${total} items processed`;
    }
    if (isSuccess) {
      return `All ${total} items processed successfully`;
    }
    if (isPartialSuccess) {
      return `${completed} succeeded, ${failed} failed`;
    }
    return `${failed} of ${total} items failed`;
  };

  const actions = [];
  if (hasFailures && onRetryFailed) {
    actions.push({
      label: `Retry ${failed} Failed`,
      onClick: onRetryFailed,
      variant: 'outline' as const,
      icon: <RefreshCw className="h-3 w-3" />
    });
  }

  return (
    <FeedbackMessage
      type={getStatus()}
      title={getTitle()}
      description={getDescription()}
      actions={actions}
      onDismiss={isComplete ? onDismiss : undefined}
      persistent={!isComplete}
      className={className}
    />
  );
};

// Progress feedback with steps
interface ProgressFeedbackProps {
  steps: Array<{
    label: string;
    status: 'pending' | 'loading' | 'success' | 'error';
    description?: string;
  }>;
  currentStep: number;
  onRetryStep?: (stepIndex: number) => void;
  className?: string;
}

export const ProgressFeedback: React.FC<ProgressFeedbackProps> = ({
  steps,
  currentStep,
  onRetryStep,
  className
}) => {
  return (
    <Card className={cn('border border-gray-200', className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {step.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                {step.status === 'loading' && (
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium',
                  step.status === 'success' && 'text-green-800',
                  step.status === 'error' && 'text-red-800',
                  step.status === 'loading' && 'text-blue-800',
                  step.status === 'pending' && 'text-gray-600'
                )}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
              {step.status === 'error' && onRetryStep && (
                <Button
                  onClick={() => onRetryStep(index)}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
              <Badge 
                variant={
                  step.status === 'success' ? 'default' :
                  step.status === 'error' ? 'destructive' :
                  step.status === 'loading' ? 'secondary' :
                  'outline'
                }
                className="text-xs"
              >
                {step.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};